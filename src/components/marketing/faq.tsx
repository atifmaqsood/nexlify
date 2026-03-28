import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How many generations do I get on the Free plan?",
    answer: "The Free plan includes 10 AI generations per month. This is perfect for trying out our tools and seeing if LaunchDesk is right for you.",
  },
  {
    question: "Can I invite my team members?",
    answer: "Absolutely! Even on the Free plan, you can create a workspace and invite team members. Higher tiers allow for more workspaces and advanced role management.",
  },
  {
    question: "Do you support custom AI tones?",
    answer: "Yes, our Pro and Enterprise plans allow you to define and save custom AI tones so your content always matches your brand's voice.",
  },
  {
    question: "Is there a long-term contract?",
    answer: "No, all our plans are month-to-month and you can cancel at any time from your billing settings.",
  },
  {
    question: "Which AI models do you use?",
    answer: "We primarily use GPT-4o for its high reasoning capabilities and speed, ensuring you get the best possible content every time.",
  },
  {
    question: "Do you offer API access?",
    answer: "Yes, API access is available on our Pro and Enterprise plans. You can find your API keys in the workspace settings.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Common Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Find answers to the most common questions about LaunchDesk.
          </p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
