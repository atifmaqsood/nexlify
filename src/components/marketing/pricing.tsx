"use client";

import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for exploring the power of AI content creation.",
    features: [
      "1,000 generations / month",
      "Standard Gemini 1.5 Flash",
      "5 Historical Records",
      "Personal Workspace",
      "Standard Support",
    ],
    buttonText: "Start Free",
    popular: false,
    priceId: "free",
  },
  {
    name: "Pro",
    price: "29",
    description: "The complete toolkit for professionals and creators.",
    features: [
      "5,000 generations / month",
      "Ultra-Fast Gemini 2.0 Flash",
      "Unlimited History",
      "3 Shared Workspaces",
      "Priority API Access",
      "Advanced Team Features",
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
    priceId: "price_PRO_MONTHLY", // Replace with real Stripe Price ID
  },
  {
    name: "Enterprise",
    price: "99",
    description: "Maximum scale and security for large teams.",
    features: [
      "Unlimited generations",
      "Dedicated Model Instances",
      "Audit logs & SAML SSO",
      "Custom Workspace Limits",
      "24/7 Priority Support",
      "Dedicated Manager",
    ],
    buttonText: "Contact Sales",
    popular: false,
    priceId: "price_ENTERPRISE",
  },
];

export function Pricing() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscription = async (priceId: string) => {
    if (priceId === "free") {
      router.push("/sign-up");
      return;
    }

    setIsLoading(priceId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          priceId,
          workspaceId: "default" // In a real app, pass the active workspace ID
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL");
      }
    } catch (error) {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            Choose the plan that's right for you. All plans include access to 
            our core AI generation features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative bg-card border-border shadow-soft flex flex-col group transition-all duration-300 hover:scale-[1.02] ${
                plan.popular ? 'border-primary ring-1 ring-primary/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-primary/20">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground font-medium">/month</span>
                </div>
                <CardDescription className="font-medium">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-0 flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm font-medium text-foreground">
                      <div className="mt-1 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-8 pt-0 mt-auto">
                <Button 
                  className={`w-full h-12 font-bold transition-all shadow-md group ${
                    plan.popular ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/20' : 'variant-outline border-border hover:bg-muted'
                  }`}
                  onClick={() => handleSubscription(plan.priceId)}
                  disabled={isLoading !== null}
                >
                  {isLoading === plan.priceId ? "Redirecting..." : (
                    <>
                      {plan.buttonText} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
