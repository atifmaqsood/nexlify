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
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  recentActivity: any[];
}

const toolConfig: Record<string, { icon: any; color: string }> = {
  "Blog Post Writer": { icon: FileTextIcon, color: "text-primary" },
  "Email Copywriter": { icon: MailIcon, color: "text-accent" },
  "Social Media": { icon: Share2Icon, color: "text-success" },
  "Product Description": { icon: SparklesIcon, color: "text-warning" },
};

export function ActivityFeed({ recentActivity }: ActivityFeedProps) {
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
            {recentActivity.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground italic text-sm">
                No recent activity. Start generating to see it here!
              </div>
            ) : (
              recentActivity.map((activity) => {
                const config = toolConfig[activity.tool_type] || { icon: SparklesIcon, color: "text-muted-foreground" };
                const Icon = config.icon;
                
                return (
                  <div key={activity.id} className="flex items-start gap-4 group">
                    <div className={`mt-1 p-2 rounded-lg bg-muted/50 ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {activity.tool_type}
                        </h4>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                          <ClockIcon className="w-3 h-3" /> 
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate italic">
                        "{activity.prompt}"
                      </p>
                    </div>
                  </div>
                );
              })
            )}
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
