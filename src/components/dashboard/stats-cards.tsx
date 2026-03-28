import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Layers, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    title: "AI Generations",
    value: "1,284",
    icon: Sparkles,
    trend: "+12.5%",
    trendUp: true,
    description: "vs last month",
    color: "text-primary",
  },
  {
    title: "Team Members",
    value: "12",
    icon: Users,
    trend: "+2",
    trendUp: true,
    description: "new this week",
    color: "text-accent",
  },
  {
    title: "Workspaces",
    value: "4",
    icon: Layers,
    trend: "0",
    trendUp: true,
    description: "active now",
    color: "text-success",
  },
  {
    title: "Plan Usage",
    value: "84%",
    icon: Zap,
    trend: "-5%",
    trendUp: false,
    description: "usage this month",
    color: "text-warning",
  },
];

export function StatsCards() {
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
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.trendUp ? 'text-success' : 'text-destructive'}`}>
                {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </span>
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
            {stat.title === "Plan Usage" && (
              <div className="mt-4">
                <Progress value={84} className="h-1.5 bg-muted" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
