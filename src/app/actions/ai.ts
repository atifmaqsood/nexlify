"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Fetches the AI generation history for the current authenticated user.
 * Uses the admin client to bypass standard RLS since auth is handled by Clerk.
 */
export async function getAIHistory() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { data, error } = await supabaseAdmin
      .from("ai_generations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("GET_AI_HISTORY_ERROR", error);
    return { data: [], error: "Failed to fetch history" };
  }
}

/**
 * Deletes a specific AI generation record for the current user.
 */
export async function deleteAIGeneration(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { error } = await supabaseAdmin
      .from("ai_generations")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("DELETE_AI_GENERATION_ERROR", error);
    return { success: false, error: "Failed to delete generation" };
  }
}
