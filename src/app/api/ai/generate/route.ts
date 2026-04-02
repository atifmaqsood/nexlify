import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

    // 2. Choose model (allow override via env). If the chosen model isn't
    //    available for generateContent, we'll fall back to a compatible one
    //    discovered via ListModels.
    const preferredModel = process.env.GOOGLE_GENERATIVE_AI_MODEL || "gemini-1.5-flash";
    let model = genAI.getGenerativeModel({ model: preferredModel }, { apiVersion: "v1" });

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

    // 4. Try preferred model; if it fails, query ListModels API and pick a compatible one.
    let result;

    try {
      model = genAI.getGenerativeModel({ model: preferredModel });
      result = await model.generateContentStream(prompt);
    } catch (err: any) {
      console.warn(
        `Preferred model ${preferredModel} failed, attempting to find available models...`
      );

      // Fetch available models from the API
      try {
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`;
        const listRes = await fetch(listUrl);
        const listData = (await listRes.json()) as any;

        const models = listData.models || [];
        console.info("Available models:", models.map((m: any) => m.name));

        // Find the first model that supports generateContent
        const compatible = models.find((m: any) => {
          const methods = m.supportedGenerationMethods || [];
          return methods.includes("generateContent");
        });

        if (!compatible) {
          throw new Error(
            `No models support generateContent. Available: ${models.map((m: any) => m.name).join(", ")}`
          );
        }

        const modelName = compatible.name;
        console.info("Using compatible model:", modelName);
        model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContentStream(prompt);
      } catch (listErr: any) {
        console.error("Failed to discover or use compatible model:", listErr);
        throw err; // Re-throw original error
      }
    }

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
