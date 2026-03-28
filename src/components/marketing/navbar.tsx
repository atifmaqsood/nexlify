"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, LayoutDashboard, LogIn, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import * as Clerk from "@clerk/nextjs";
const { SignedIn, SignedOut, UserButton, SignInButton } = Clerk as any;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border py-2 px-6"
          : "bg-transparent border-transparent py-4 px-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20 group-hover:scale-110 transition-all duration-300">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors italic">
            Nexlify
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors italic tracking-wide"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors italic tracking-wide"
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors italic tracking-wide"
          >
            Testimonials
          </Link>
          <Link
            href="#faq"
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors italic tracking-wide"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex font-bold hover:text-primary italic">
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 font-extrabold italic px-6 h-10 tracking-wider">
                <Sparkles className="w-4 h-4 mr-2" /> Start Free
              </Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex font-bold hover:text-primary italic gap-2">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Button>
            </Link>
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-9 h-9 border-2 border-primary/20 shadow-md",
                }
              }} 
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
