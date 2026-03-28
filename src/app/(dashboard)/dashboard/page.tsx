import { StatsCards } from "@/components/dashboard/stats-cards";
import { UsageCharts } from "@/components/dashboard/usage-charts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome back!</h2>
        <p className="text-muted-foreground">Here's what's happening with your AI generations today.</p>
      </div>
      
      <StatsCards />
      
      <UsageCharts />
      
      <ActivityFeed />
    </div>
  );
}
