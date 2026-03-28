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
import { OrganizationSwitcher, UserButton, useOrganization } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const { organization } = useOrganization();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r border-border bg-card transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Header / Logo */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              LaunchDesk
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="mx-auto bg-primary p-1.5 rounded-lg">
            <Rocket className="w-5 h-5 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-10 h-6 w-6 rounded-full border border-border bg-background hidden md:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>
      </div>

      {/* Workspace Switcher */}
      <div className={cn("px-4 mb-8", isCollapsed ? "flex justify-center" : "")}>
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: "w-full",
              organizationSwitcherTrigger: cn(
                "w-full px-2 py-1.5 border border-border bg-muted/50 hover:bg-muted text-foreground rounded-lg transition-colors",
                isCollapsed && "px-0 justify-center border-none bg-transparent"
              ),
              organizationPreviewMainIdentifier: "text-sm font-semibold",
              organizationPreviewSecondaryIdentifier: "text-xs text-muted-foreground",
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
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "" : "group-hover:text-primary transition-colors")} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              {!isCollapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User */}
      <div className={cn("p-4 border-t border-border mt-auto", isCollapsed ? "flex flex-col items-center gap-4" : "flex items-center justify-between")}>
        <div className="flex items-center gap-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9 border border-border shadow-sm",
              },
            }}
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">Pro Plan</span>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-primary/30 text-primary bg-primary/5 uppercase font-bold">
                Active
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
        <div className="bg-primary p-1.5 rounded-lg text-white">
          <Rocket className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold">LaunchDesk</span>
      </Link>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 border-r border-border bg-card">
          <Sidebar className="w-full border-none" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
