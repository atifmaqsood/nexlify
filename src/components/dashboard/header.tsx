"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  
  // Format title from pathname: /dashboard/ai-tools -> AI Tools
  const getTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace("-", " ");
  };

  return (
    <header className="h-16 md:h-16 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground hidden md:block">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="relative max-w-sm w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search generations, team..." 
            className="pl-9 bg-muted/30 border-border focus-visible:ring-primary h-9 rounded-lg"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>
        </div>
      </div>
    </header>
  );
}
