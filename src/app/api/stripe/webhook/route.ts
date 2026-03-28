import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

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

    if (!session?.metadata?.workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    // Update workspace plan and stripe info in Supabase
    await supabase
      .from("workspaces")
      .update({
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        plan: "PRO", // Simplified for now
      })
      .eq("id", session.metadata.workspaceId);
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the subscription details (e.g., current period end)
    await supabase
      .from("workspaces")
      .update({
        plan: "PRO",
      })
      .eq("stripe_subscription_id", subscription.id);
  }

  return new NextResponse(null, { status: 200 });
}
