import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for exploring the power of AI.",
    features: [
      "10 AI Generations / mo",
      "1 Team Workspace",
      "Basic Analytics",
      "Standard Support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "29",
    description: "Best for growing teams and creators.",
    features: [
      "Unlimited AI Generations",
      "5 Team Workspaces",
      "Advanced Analytics",
      "Priority Support",
      "Custom AI Tones",
      "API Access",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "99",
    description: "Advanced features for large organizations.",
    features: [
      "Unlimited AI Generations",
      "Unlimited Workspaces",
      "Custom AI Models",
      "Dedicated Support",
      "SSO & Security",
      "Whitelabeling",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the best plan for your team and start generating today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border ${
                tier.popular
                  ? "border-primary bg-primary/5 shadow-2xl scale-105 z-10"
                  : "border-border bg-card"
              } flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-foreground">${tier.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 text-sm text-foreground/80">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`w-full h-12 rounded-xl transition-all ${
                  tier.popular
                    ? "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                    : "bg-muted hover:bg-muted/80 text-foreground border border-border"
                }`}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
