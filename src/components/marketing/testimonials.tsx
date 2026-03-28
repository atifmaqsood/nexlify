import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Manager @ TechFlow",
    content: "LaunchDesk has completely changed how we handle our blog content. We've tripled our output while maintaining high quality.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "David Chen",
    role: "Marketing Director @ Waveform",
    content: "The workspace management and role-based access make it so easy to collaborate with our freelancers. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?u=david",
  },
  {
    name: "Elena Rodriguez",
    role: "Founder @ SoloGrowth",
    content: "As a solo founder, LaunchDesk is like having a full-time content team. The AI social media captions are incredibly consistent.",
    avatar: "https://i.pravatar.cc/150?u=elena",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Loved by Teams Everywhere
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of professionals who are scaling their content with LaunchDesk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-8 rounded-2xl border border-border shadow-soft flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-12 h-12 border border-border">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
