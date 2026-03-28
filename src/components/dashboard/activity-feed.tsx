"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles as SparklesIcon, 
  Mail as MailIcon, 
  Share2 as Share2Icon, 
  FileText as FileTextIcon, 
  Clock as ClockIcon,
  Plus as PlusIcon,
  UserPlus as UserPlusIcon,
  CreditCard as CreditCardIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const activities = [
  {
    id: 1,
    tool: "Blog Post Writer",
    summary: "How to scale a SaaS in 2026...",
    time: "2 mins ago",
    icon: FileTextIcon,
    color: "text-primary",
  },
  {
    id: 2,
    tool: "Email Copywriter",
    summary: "Cold outreach for VCs",
    time: "15 mins ago",
    icon: MailIcon,
    color: "text-accent",
  },
  {
    id: 3,
    tool: "Social Media",
    summary: "Product launch announcement",
    time: "1 hour ago",
    icon: Share2Icon,
    color: "text-success",
  },
  {
    id: 4,
    tool: "Product Description",
    summary: "Next-gen AI dashboard features",
    time: "3 hours ago",
    icon: SparklesIcon,
    color: "text-warning",
  },
  {
    id: 5,
    tool: "Blog Post Writer",
    summary: "Future of Agentic Coding",
    time: "5 hours ago",
    icon: FileTextIcon,
    color: "text-primary",
  },
];

export function ActivityFeed() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Recent Activity */}
      <Card className="xl:col-span-2 bg-card border-border shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Recent Activity
          </CardTitle>
          <Link href="/ai-tools">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 group">
                <div className={`mt-1 p-2 rounded-lg bg-muted/50 ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{activity.tool}</h4>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                      <ClockIcon className="w-3 h-3" /> {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate italic">"{activity.summary}"</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/ai-tools" className="block">
            <Button className="w-full justify-start gap-3 h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <PlusIcon className="w-4 h-4" /> New AI Generation
            </Button>
          </Link>
          <Link href="/team" className="block">
            <Button variant="outline" className="w-full justify-start gap-3 h-12 border-border hover:bg-muted font-bold">
              <UserPlusIcon className="w-4 h-4" /> Invite Member
            </Button>
          </Link>
          <Link href="/billing" className="block">
            <Button variant="outline" className="w-full justify-start gap-3 h-12 border-border hover:bg-muted font-bold">
              <CreditCardIcon className="w-4 h-4" /> Upgrade Plan
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
