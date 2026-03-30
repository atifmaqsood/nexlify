import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;
  const stripe = getStripe();

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.workspaceId || !session?.metadata?.userId) {
      return new NextResponse("Metadata is required", { status: 400 });
    }

    // 1. Update workspace plan and stripe info
    const { error: wsError } = await supabaseAdmin
      .from("workspaces")
      .update({
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        plan: "PRO",
      })
      .eq("id", session.metadata.workspaceId);

    if (wsError) throw wsError;

    // 2. Initialize Usage Limits for the new period
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const { error: usageError } = await supabaseAdmin
      .from("usage_limits")
      .upsert({
        workspace_id: session.metadata.workspaceId,
        month_year: currentMonth,
        generation_count: 0,
        reset_at: new Date((subscription as any).current_period_end * 1000).toISOString(),
      }, { onConflict: "workspace_id, month_year" });

    if (usageError) console.error("USAGE_LIMIT_INIT_ERROR", usageError);
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the subscription details (renewing the plan)
    await supabaseAdmin
      .from("workspaces")
      .update({
        plan: "PRO",
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  return new NextResponse(null, { status: 200 });
}
