"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Layers, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatsCardsProps {
  totalGenerations: number;
  totalWorkspaces: number;
  totalMembers: number;
  usageLimit: number;
}

export function StatsCards({ 
  totalGenerations, 
  totalWorkspaces, 
  totalMembers, 
  usageLimit 
}: StatsCardsProps) {
  
  // Calculate usage percentage
  const usagePercentage = Math.round((totalGenerations / usageLimit) * 100);

  const stats = [
    {
      title: "AI Generations",
      value: totalGenerations.toLocaleString(),
      icon: Sparkles,
      trend: "+100%", // Mock trend for now until we have historical aggregation
      trendUp: true,
      description: "total generated",
      color: "text-primary",
    },
    {
      title: "Team Members",
      value: totalMembers.toLocaleString(),
      icon: Users,
      trend: "+1",
      trendUp: true,
      description: "current team",
      color: "text-accent",
    },
    {
      title: "Workspaces",
      value: totalWorkspaces.toLocaleString(),
      icon: Layers,
      trend: "0",
      trendUp: true,
      description: "active now",
      color: "text-success",
    },
    {
      title: "Plan Usage",
      value: `${usagePercentage}%`,
      icon: Zap,
      trend: usagePercentage > 80 ? "+20%" : "-5%",
      trendUp: usagePercentage > 80,
      description: "usage this month",
      color: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border shadow-soft overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-muted/50 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
              {stat.value}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.trendUp ? 'text-success' : 'text-destructive'}`}>
                {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </span>
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
            {stat.title === "Plan Usage" && (
              <div className="mt-4">
                <Progress value={usagePercentage} className="h-1.5 bg-muted" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
