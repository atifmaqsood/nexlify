import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai"; // Wait, I need 'ai' package for easier streaming helper
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// I'll check if 'ai' package is installed. If not, I'll install it or manual stream.
// I'll use manual stream for now to avoid dependency issues if not installed.

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { tool, inputs } = await req.json();
    const { topic, tone, length, keywords } = inputs;

    const prompt = `You are a professional AI content writer. 
      Generate a ${length} ${tool} about "${topic}" in a ${tone} tone.
      ${keywords ? `Include these keywords: ${keywords}` : ""}
      Ensure the content is high-quality, engaging, and well-structured.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using 3.5-turbo as requested for cost, but GPT-4o is also fine
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error("[AI_GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
