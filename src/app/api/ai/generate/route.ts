import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { tool, inputs } = body;
    const { topic, tone, length, keywords } = inputs;

    // 1. Initialize the official stable Google Generative AI SDK
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

    // 2. Explicitly request the "v1" stable API version to bypass v1beta restrictions
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      { apiVersion: "v1" }
    );

    const prompt = `
      You are an expert AI content creator. Create content for a ${tool}.
      Topic: ${topic}
      Tone: ${tone}
      Length: ${length}
      Keywords: ${keywords || "none"}
      
      Ensure the content is high-quality, engaging, and professional.
    `;

    // 3. Start streaming
    const result = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();
    let fullText = "";

    // 4. Create a ReadableStream for the frontend
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              fullText += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          // 5. Save to history once complete
          if (fullText) {
            try {
              // A. Find or create a workspace for the user (required for foreign key)
              let { data: workspace, error: wsError } = await supabaseAdmin
                .from("workspaces")
                .select("id")
                .eq("owner_id", userId)
                .single();

              if (wsError && wsError.code === "PGRST116") {
                // If no workspace found, create a default one
                const { data: newWs, error: createError } = await supabaseAdmin
                  .from("workspaces")
                  .insert({
                    name: "Personal Workspace",
                    owner_id: userId,
                    slug: `personal-${userId.slice(-5)}`,
                  })
                  .select()
                  .single();
                
                if (createError) throw createError;
                workspace = newWs;
              } else if (wsError) {
                throw wsError;
              }

              // B. Insert into history with workspace and user ID
              const { error: insertError } = await supabaseAdmin
                .from("ai_generations")
                .insert({
                  workspace_id: workspace?.id,
                  user_id: userId,
                  tool_type: tool,
                  prompt: topic,
                  output: fullText,
                });

              if (insertError) {
                console.error("SUPABASE_INSERT_ERROR:", insertError);
              }
            } catch (e) {
              console.error("HISTORY_PERSISTENCE_FAILED", e);
            }
          }

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("[AI_GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
