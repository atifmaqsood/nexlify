"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

/**
 * Validates and accepts a workspace invitation.
 */
export async function acceptInvitation(token: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // 1. Find the invitation
    const { data: invitation, error: findError } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("token", token)
      .single();

    if (findError || !invitation) {
      return { error: "Invalid or expired invitation token." };
    }

    // 2. Check Expiry
    if (new Date(invitation.expires_at) < new Date()) {
      return { error: "This invitation has expired." };
    }

    // 3. Add to workspace members
    const { error: joinError } = await supabaseAdmin
      .from("workspace_members")
      .insert({
        workspace_id: invitation.workspace_id,
        user_id: userId,
        role: invitation.role || "member",
      });

    if (joinError) {
      if (joinError.code === "23505") {
        // Already a member
        return { error: "You are already a member of this workspace." };
      }
      throw joinError;
    }

    // 4. Delete the invitation
    await supabaseAdmin.from("invitations").delete().eq("id", invitation.id);

    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    console.error("ACCEPT_INVITE_ERROR", error);
    return { error: "An unexpected error occurred while accepting the invitation." };
  }
}

/**
 * Updates the workspace name/slug for the current owner.
 */
export async function updateWorkspace(name: string, slug?: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { error } = await supabaseAdmin
      .from("workspaces")
      .update({ name, slug })
      .eq("owner_id", userId);

    if (error) throw error;

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("UPDATE_WORKSPACE_ERROR", error);
    return { success: false, error: "Failed to update workspace." };
  }
}
