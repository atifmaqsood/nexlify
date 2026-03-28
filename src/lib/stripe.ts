import Stripe from "stripe";

// We use a getter or a fallback to prevent module evaluation crash if the key is missing in local dev.
// The actual error will be caught gracefully in the API route handler instead of crashing the whole server.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.dahlia", 
  typescript: true,
});
