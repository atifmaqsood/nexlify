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

    // 2. Use gemini-1.5-flash for the best balance of speed and quality
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: "v1" }
    );

    // 3. Sophisticated System Prompts for Industry-Leading Output
    const systemPrompts: Record<string, string> = {
      "Blog Post Writer": `You are an elite SEO content strategist. Write a comprehensive, high-converting blog post.
        Structure: Catchy Headline, Introduction with a hook, Multiple H2/H3 sections, Bullet points for readability, and a strong Call to Action.
        Optimization: Natural integration of keywords.`,
      "Email Copywriter": `You are a world-class direct response copywriter. Write a persuasive email.
        Focus: Subject line that demands to be opened, personalized feel, clear pain point addressing, and a single undeniable Call to Action.`,
      "Social Media": `You are a viral social media manager. Create engaging content for LinkedIn, Twitter, and Instagram.
        Focus: Use intentional spacing, relevant emojis, and trending hooks to maximize engagement and shareability.`,
      "Product Description": `You are a luxury e-commerce specialist. Write an irresistible product description.
        Focus: Highlight benefits over features, create a sense of belonging or status, and use sensory language to drive sales.`,
    };

    const toolPrompt = systemPrompts[tool] || "You are an expert AI content creator.";

    const prompt = `
      ${toolPrompt}
      
      Topic: ${topic}
      Tone: ${tone}
      Length: ${length}
      Keywords: ${keywords || "none"}
      
      IMPORTANT: Return the content in beautifully formatted Markdown. 
      Ensure the output is high-impact, industry-standard content.
    `;

    // 4. Start streaming
    const result = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();
    let fullText = "";

    // 5. Create a ReadableStream for the frontend
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

          // 6. Save to history once complete
          if (fullText) {
            try {
              let { data: workspace, error: wsError } = await supabaseAdmin
                .from("workspaces")
                .select("id")
                .eq("owner_id", userId)
                .single();

              if (wsError && wsError.code === "PGRST116") {
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
              }

              const { error: insertError } = await supabaseAdmin
                .from("ai_generations")
                .insert({
                  workspace_id: workspace?.id,
                  user_id: userId,
                  tool_type: tool,
                  prompt: topic,
                  output: fullText,
                });

              if (insertError) console.error("HISTORY_SAVE_ERROR:", insertError);
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
