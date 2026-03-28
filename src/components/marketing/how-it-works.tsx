import { 
  UserPlus, 
  MessageSquarePlus, 
  Rocket 
} from "lucide-react";

const steps = [
  {
    title: "Create Account",
    description: "Sign up in seconds and create your first workspace for your team.",
    icon: UserPlus,
    color: "text-primary",
  },
  {
    title: "Generate Content",
    description: "Use our AI tools to generate high-quality content tailored to your needs.",
    icon: MessageSquarePlus,
    color: "text-accent",
  },
  {
    title: "Publish & Scale",
    description: "Review, edit, and publish your content across all your channels.",
    icon: Rocket,
    color: "text-success",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg text-secondary-foreground">
            Get started in minutes and see the results immediately.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block -z-10" />
          
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center bg-background p-8 rounded-2xl border border-border shadow-xl relative">
              <div className="w-16 h-16 rounded-full bg-background border-4 border-muted flex items-center justify-center mx-auto mb-6 relative z-10 transition-transform hover:scale-110">
                <step.icon className={`w-8 h-8 ${step.color}`} />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs ring-4 ring-background">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
