"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function getWorkspace() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data: workspace } = await supabaseAdmin
    .from("workspaces")
    .select("*")
    .eq("owner_id", userId)
    .single();

  return workspace;
}

export async function getWorkspaceMembers() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const workspace = await getWorkspace();
    if (!workspace) return { data: [] };

    const { data: members, error } = await supabaseAdmin
      .from("workspace_members")
      .select("*")
      .eq("workspace_id", workspace.id);

    if (error) throw error;
    return { data: members || [] };
  } catch (error) {
    console.error("GET_MEMBERS_ERROR", error);
    return { data: [], error: "Failed to fetch members" };
  }
}

export async function inviteMember(email: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const workspace = await getWorkspace();
    if (!workspace) throw new Error("Workspace not found");

    const token = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

    const { error } = await supabaseAdmin
      .from("invitations")
      .insert({
        workspace_id: workspace.id,
        email,
        token,
        expires_at: expiresAt.toISOString(),
        role: "member",
      });

    if (error) throw error;

    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    console.error("INVITE_ERROR", error);
    return { success: false, error: "Failed to send invitation" };
  }
}
