"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Sparkles, 
  Users, 
  CreditCard, 
  Settings,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getWorkspace } from "@/app/actions/workspace";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "AI Tools", icon: Sparkles, href: "/ai-tools" },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Billing", icon: CreditCard, href: "/billing" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [plan, setPlan] = useState<string>("FREE");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const ws = await getWorkspace();
        setPlan(ws?.plan || "FREE");
      } catch (e) {
        setPlan("FREE");
      }
    };
    fetchPlan();
  }, []);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r border-border bg-card transition-all duration-300 ease-in-out z-40 shadow-xl shadow-black/5",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Header / Logo */}
      <div className={cn("flex items-center transition-all duration-300", isCollapsed ? "p-4 justify-center" : "p-6 justify-between")}>
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors italic">
              Nexlify
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20 hover:scale-110 transition-transform">
            <Rocket className="w-5 h-5 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-3 top-10 h-6 w-6 rounded-full border border-border bg-background hidden md:flex z-50 hover:bg-muted shadow-sm",
            isCollapsed && "right-3"
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>
      </div>

      {/* Workspace Switcher */}
      <div className={cn("px-4 mb-8 transition-all duration-300", isCollapsed ? "flex justify-center px-0" : "")}>
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: "w-full flex justify-center",
              organizationSwitcherTrigger: cn(
                "w-full px-2 py-1.5 border border-border bg-muted/50 hover:bg-muted text-foreground rounded-lg transition-all",
                isCollapsed && "w-10 h-10 p-0 border-none bg-transparent hover:bg-muted/50 justify-center"
              ),
              organizationPreviewMainIdentifier: cn(
                "text-sm font-bold italic",
                isCollapsed && "hidden"
              ),
              organizationPreviewSecondaryIdentifier: cn(
                "text-[10px] text-muted-foreground font-medium uppercase tracking-widest",
                isCollapsed && "hidden"
              ),
              organizationSwitcherTriggerIcon: cn(
                isCollapsed && "hidden"
              )
            },
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isCollapsed && "justify-center px-0 w-10 h-10 mx-auto"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "" : "group-hover:text-primary transition-colors")} />
              {!isCollapsed && <span className="text-sm font-bold italic">{item.label}</span>}
              {!isCollapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User */}
      <div className={cn("p-4 border-t border-border mt-auto transition-all", isCollapsed ? "flex justify-center border-none" : "flex items-center justify-between")}>
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9 border border-border shadow-sm ring-1 ring-primary/10",
              },
            }}
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-foreground uppercase tracking-wider italic">
                {plan === "PRO" ? "Pro Plan" : "Free Plan"}
              </span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-[9px] h-4 px-1.5 uppercase font-extrabold tracking-widest",
                  plan === "PRO" 
                    ? "border-primary/30 text-primary bg-primary/5" 
                    : "border-muted-foreground/30 text-muted-foreground bg-muted/5"
                )}
              >
                {plan === "PRO" ? "Active" : "Trial"}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card flex items-center justify-between px-4 z-40">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20 text-white">
          <Rocket className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold italic tracking-tight">Nexlify</span>
      </Link>
      
      <Sheet>
        <SheetTrigger className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-6 h-6 text-foreground" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 border-r border-border bg-card w-64 translate-x-0">
          <Sidebar className="w-full border-none" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
