"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Terminal, ShieldCheck, Zap } from "lucide-react";

const DEMO_STEPS = [
  {
    tool: "Blog Post Writer",
    prompt: "Generate a blog post about the future of AI in 2026...",
    output: "The year 2026 marks a pivotal turning point in human-AI collaboration. As agentic systems move from basic assistants to specialized partners, industries from healthcare to software development are being fundamentally reshaped...",
    icon: Sparkles,
    color: "text-primary",
  },
  {
    tool: "Email Copywriter",
    prompt: "Write a high-converting cold email for a SaaS product...",
    output: "Subject: Can nexlify solve your content bottleneck?\n\nHi Sarah, I noticed your team is scaling fast. Most growing companies struggle with consistent output—that's why we built nexlify...",
    icon: Zap,
    color: "text-accent",
  },
];

export function GPTDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentStep = DEMO_STEPS[stepIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      if (displayText.length < currentStep.output.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentStep.output.slice(0, displayText.length + 2));
        }, 30);
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          // Wait before clearing and moving to next step
          setIsTyping(true);
          setDisplayText("");
          setStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
        }, 4000);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentStep]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 perspective-1000">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-2xl border border-border bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-border bg-muted/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/30" />
              <div className="w-3 h-3 rounded-full bg-warning/30" />
              <div className="w-3 h-3 rounded-full bg-success/30" />
            </div>
            <div className="h-4 w-[1px] bg-border mx-2" />
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-muted/50 border border-border/50">
              <currentStep.icon className={`w-3 h-3 ${currentStep.color}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground italic">
                {currentStep.tool}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium bg-muted/50 px-2 py-0.5 rounded border border-border/50">
            <Terminal className="w-3 h-3" />
            <span>gemini-2.0-flash</span>
          </div>
        </div>

        {/* Console Content */}
        <div className="p-6 md:p-8 space-y-6 min-h-[300px]">
          {/* Prompt */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary italic">U</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-foreground mb-1 italic">Prompt:</div>
              <div className="text-muted-foreground text-sm leading-relaxed font-medium">
                {currentStep.prompt}
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

          {/* AI Response */}
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 animate-pulse">
              <currentStep.icon className={`w-4 h-4 ${currentStep.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-foreground italic flex items-center gap-2">
                  Nexlify AI
                  {isTyping && (
                    <span className="flex gap-1">
                      <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-bold uppercase tracking-widest bg-success/10 text-success px-1.5 py-0.5 rounded border border-success/20">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified Output
                </div>
              </div>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium">
                {displayText}
                {isTyping && <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-4 ml-0.5 bg-primary align-middle"
                />}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Glow */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      </motion.div>
      
      {/* Decorative Orbs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-[80px] -z-10" />
    </div>
  );
}
