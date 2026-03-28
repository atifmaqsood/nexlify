"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

const MOCK_GENERATIONS = [
  {
    tool_type: "Blog Post Writer",
    prompt: "How AI is transforming modern marketing workflows in 2026",
    output: "The digital landscape is shifting at an unprecedented pace. In 2026, AI is no longer a luxury; it is the engine of human creativity. By automating the mechanical aspects of writing, marketers are now free to focus on the high-level strategy that truly connects brands with their audiences...",
    daysAgo: 0,
  },
  {
    tool_type: "Email Copywriter",
    prompt: "A welcoming introductory email for a new SaaS product called Nexlify",
    output: "Subject: Welcome to the Future of Content Generation with Nexlify!\n\nHi there,\n\nWe are thrilled to have you join our community. Nexlify was built with one goal in mind: to help teams like yours scale their content output without sacrificing the human touch. From professional blogs to high-converting social captions, you now have an expert team at your fingertips...",
    daysAgo: 1,
  },
  {
    tool_type: "Social Media",
    prompt: "A series of 3 engaging Instagram captions for a product launch",
    output: "1. 🚀 The wait is finally over. Say hello to Nexlify—your new secret weapon for content that converts. Link in bio to start your trial! #SaaS #AI #Marketing\n\n2. Stop staring at blank screens. Nexlify turns your raw ideas into professional drafts in seconds. ✨ #ContentStrategy\n\n3. Consistent. Professional. Scalable. That’s the Nexlify promise. Elevate your brand today. 📈",
    daysAgo: 2,
  },
  {
    tool_type: "Product Description",
    prompt: "Compelling description for a high-end ergonomic desk chair",
    output: "Experience the pinnacle of comfort and productivity. The Aeron-X Elite is engineered for those who spend their lives at the intersection of design and performance. Featuring a 3D-knit lumbar support system and aircraft-grade aluminum frame, it doesn't just support your back—it supports your ambitions.",
    daysAgo: 3,
  },
  {
    tool_type: "Blog Post Writer",
    prompt: "The importance of data privacy in the age of generative AI",
    output: "As generative models become more integrated into our daily workflows, the conversation around data security has never been more critical. At Nexlify, we believe that innovation must be built on a foundation of trust. In this post, we explore the protocols that ensure your proprietary ideas remain exactly that—yours.",
    daysAgo: 4,
  },
  {
    tool_type: "Social Media",
    prompt: "LinkedIn post sharing a win about reaching 10k users",
    output: "Today, Nexlify reached a massive milestone: 10,000 active creators! 🎉 This journey started with a simple vision to bridge the gap between AI and human creativity. Thank you to everyone who has been part of this ride. This is just the beginning. #Milestone #StartupLife #Growth",
    daysAgo: 5,
  },
  {
    tool_type: "Email Copywriter",
    prompt: "Follow-up email for a missed demo appointment",
    output: "Subject: Sorry we missed you!\n\nHi [Name],\n\nI noticed we weren't able to connect for our Nexlify demo today. I still really want to show you how our platform can save your team 10+ hours a week on content creation. Would any of these times work for a quick rescheduled call next week?",
    daysAgo: 6,
  }
];

export async function seedOrganicData() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Get the workspace
    const { data: workspace } = await supabaseAdmin
      .from("workspaces")
      .select("*")
      .eq("owner_id", userId)
      .single();

    if (!workspace) throw new Error("Workspace not found");

    // 2. Prepare mock generations with historical dates
    const generationsToInsert = MOCK_GENERATIONS.map(gen => {
      const date = new Date();
      date.setDate(date.getDate() - gen.daysAgo);
      return {
        workspace_id: workspace.id,
        user_id: userId,
        tool_type: gen.tool_type,
        prompt: gen.prompt,
        output: gen.output,
        created_at: date.toISOString(),
      };
    });

    // 3. Clear existing data (Optional, but makes it cleaner for a fresh presentation)
    // await supabaseAdmin.from("ai_generations").delete().eq("user_id", userId);

    // 4. Insert generations
    const { error: genError } = await supabaseAdmin
      .from("ai_generations")
      .insert(generationsToInsert);

    if (genError) throw genError;

    // 5. Add mock team members
    const mockMembers = [
      { workspace_id: workspace.id, user_id: "user_mock_001", role: "member", joined_at: new Date(Date.now() - 10000000).toISOString() },
      { workspace_id: workspace.id, user_id: "user_mock_002", role: "editor", joined_at: new Date(Date.now() - 20000000).toISOString() },
      { workspace_id: workspace.id, user_id: "user_mock_003", role: "admin", joined_at: new Date(Date.now() - 30000000).toISOString() },
    ];

    // Add them to workspace_members (Ignoring conflicts)
    await supabaseAdmin.from("workspace_members").insert(mockMembers);

    revalidatePath("/dashboard");
    revalidatePath("/ai-tools");
    revalidatePath("/team");

    return { success: true, message: "Presentation data successfully seeded! Your dashboard is now populated." };
  } catch (error: any) {
    console.error("SEED_ERROR", error);
    return { success: false, error: error.message || "Failed to seed data." };
  }
}
