"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now with GPT-4o Integration
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.1]">
            Transform Your Content with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              AI-Powered Precision
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            LaunchDesk is the all-in-one platform for teams to generate, manage, 
            and scale their AI-driven content strategy. From blog posts to 
            social media, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 border-border hover:bg-muted gap-2">
              <Play className="w-4 h-4 fill-current" /> Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-xl border border-border bg-card/50 backdrop-blur-sm p-2 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
            <div className="rounded-lg bg-background/80 border border-border overflow-hidden">
              <div className="border-b border-border p-3 flex items-center gap-2 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                </div>
                <div className="mx-auto bg-muted/50 rounded px-3 py-1 text-[10px] text-muted-foreground border border-border/50">
                  app.launchdesk.ai/dashboard
                </div>
              </div>
              <div className="aspect-[16/9] md:aspect-[21/9] flex bg-background p-4 gap-4">
                <div className="w-1/4 h-full border-r border-border pr-4 hidden md:block">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-8 rounded-md ${i === 1 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 rounded-xl bg-muted/30 border border-border/50" />
                    <div className="h-20 rounded-xl bg-muted/30 border border-border/50" />
                    <div className="h-20 rounded-xl bg-muted/30 border border-border/50" />
                  </div>
                  <div className="h-40 rounded-xl bg-muted/20 border border-border/50 p-4">
                    <div className="h-full w-full border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center">
                      <div className="space-y-2 text-center">
                        <div className="h-2 w-32 bg-muted/50 rounded mx-auto" />
                        <div className="h-2 w-24 bg-muted/40 rounded mx-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Hover Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          
          {/* Floating Element 1 */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 md:-top-12 md:-right-12 hidden sm:block"
          >
            <div className="bg-card border border-border p-4 rounded-xl shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-success animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Usage</div>
                  <div className="text-sm font-bold text-foreground">84% Capacity</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
