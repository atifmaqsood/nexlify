import { 
  Sparkles, 
  Users, 
  BarChart3, 
  CreditCard, 
  ShieldCheck, 
  Zap 
} from "lucide-react";

const features = [
  {
    title: "AI Content Generation",
    description: "Generate high-quality blog posts, emails, and social media captions in seconds using GPT-4o.",
    icon: Sparkles,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Team Workspaces",
    description: "Collaborate seamlessly with your team in shared workspaces with real-time updates.",
    icon: Users,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "Usage Analytics",
    description: "Track your AI usage and generation metrics with beautiful, interactive charts.",
    icon: BarChart3,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Billing Management",
    description: "Manage subscriptions, invoices, and usage-based billing through our Stripe integration.",
    icon: CreditCard,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    title: "Role-Based Access",
    description: "Assign roles and permissions to team members to maintain security and control.",
    icon: ShieldCheck,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "API Integrations",
    description: "Connect LaunchDesk to your existing workflow with our robust API and webhooks.",
    icon: Zap,
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Everything You Need to <br />
            <span className="text-primary">Scale Your Content</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful tools designed for modern teams who want to leverage AI 
            without the complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
