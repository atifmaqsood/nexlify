"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Fetches the AI generation history for the current authenticated user.
 */
export async function getAIHistory() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

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
    if (!userId) throw new Error("Unauthorized");

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

/**
 * Aggregates all dashboard data from Supabase for the current user.
 * This powers the "Live" dashboard Phase 1.
 */
export async function getDashboardData() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Fetch Basic Totals
    const [genRes, wsRes, memberRes] = await Promise.all([
      supabaseAdmin.from("ai_generations").select("*", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("workspaces").select("*", { count: "exact", head: true }).eq("owner_id", userId),
      supabaseAdmin.from("workspace_members").select("*", { count: "exact", head: true }).eq("user_id", userId)
    ]);

    // 2. Fetch Last 7 Days of Activity for the Line Chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: recentGens, error: recentError } = await supabaseAdmin
      .from("ai_generations")
      .select("created_at, tool_type")
      .eq("user_id", userId)
      .gte("created_at", sevenDaysAgo.toISOString());

    if (recentError) throw recentError;

    // 3. Process Usage Over Time (Last 7 Days)
    const usageMap: Record<string, number> = {};
    const typeMap: Record<string, number> = {
      "Blog Post Writer": 0,
      "Email Copywriter": 0,
      "Social Media": 0,
      "Product Description": 0
    };

    // Initialize usage map with 0 for the last 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      usageMap[dateStr] = 0;
    }

    recentGens?.forEach(gen => {
      const date = gen.created_at.split("T")[0];
      if (usageMap[date] !== undefined) usageMap[date]++;
      if (typeMap[gen.tool_type] !== undefined) typeMap[gen.tool_type]++;
    });

    const usageData = Object.entries(usageMap)
      .map(([date, count]) => ({ day: date.slice(8, 10), count }))
      .reverse();

    const typeData = [
      { name: "Blog Posts", count: typeMap["Blog Post Writer"], color: "#6366F1" },
      { name: "Emails", count: typeMap["Email Copywriter"], color: "#8B5CF6" },
      { name: "Social Media", count: typeMap["Social Media"], color: "#10B981" },
      { name: "Product", count: typeMap["Product Description"], color: "#F59E0B" }
    ];

    // 4. Fetch Recent Activity (Top 5)
    const { data: activity } = await supabaseAdmin
      .from("ai_generations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      stats: {
        totalGenerations: genRes.count || 0,
        totalWorkspaces: wsRes.count || 0,
        totalMembers: memberRes.count || 0,
        usageLimit: 5000, // Hardcoded for now until billing logic is full
      },
      usageData,
      typeData,
      recentActivity: activity || []
    };
  } catch (error) {
    console.error("GET_DASHBOARD_DATA_ERROR", error);
    return null;
  }
}
