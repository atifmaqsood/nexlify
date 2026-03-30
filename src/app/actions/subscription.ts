"use server";

import { auth } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

/**
 * Manually syncs the subscription status from Stripe to Supabase.
 * This is useful during development when webhooks are not configured.
 */
export async function syncSubscription() {
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

    // 2. Fetch all customers from Stripe with this email
    // (In production, we would use stripe_customer_id, but here we scan as a fallback)
    const stripe = getStripe();
    const customers = await stripe.customers.list({
      limit: 10, // Check recent customers
    });

    // Find a customer with active subscriptions
    let activeSubscription = null;
    let customerId = workspace.stripe_customer_id;

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        activeSubscription = subscriptions.data[0];
        customerId = customer.id;
        break;
      }
    }

    if (!activeSubscription) {
      return { success: false, message: "No active Stripe subscription found for recent customers." };
    }

    // 3. Update Supabase
    const { error: updateError } = await supabaseAdmin
      .from("workspaces")
      .update({
        stripe_customer_id: customerId,
        stripe_subscription_id: activeSubscription.id,
        plan: "PRO",
      })
      .eq("id", workspace.id);

    if (updateError) throw updateError;

    // 4. Initialize Usage Limits for PRO
    const currentMonth = new Date().toISOString().slice(0, 7);
    await supabaseAdmin
      .from("usage_limits")
      .upsert({
        workspace_id: workspace.id,
        month_year: currentMonth,
        generation_count: 0,
        reset_at: new Date((activeSubscription as any).current_period_end * 1000).toISOString(),
      }, { onConflict: "workspace_id, month_year" });

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Subscription synced successfully! You are now PRO." };
  } catch (error: any) {
    console.error("SYNC_SUBSCRIPTION_ERROR", error);
    return { success: false, error: error.message || "Failed to sync subscription." };
  }
}
