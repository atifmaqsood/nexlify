import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const absoluteUrl = (path: string) => `${process.env.NEXT_PUBLIC_APP_URL}${path}`;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { priceId, workspaceId } = await req.json();

    // 1. Resolve Workspace ID if "default" was passed
    let targetWorkspaceId = workspaceId;
    if (targetWorkspaceId === "default") {
      const { data: ws } = await supabaseAdmin
        .from("workspaces")
        .select("id")
        .eq("owner_id", userId)
        .single();
      
      targetWorkspaceId = ws?.id || "personal";
    }

    // 2. Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: absoluteUrl("/billing?success=1"),
      cancel_url: absoluteUrl("/billing?canceled=1"),
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        workspaceId: targetWorkspaceId,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
