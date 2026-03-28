import { StatsCards } from "@/components/dashboard/stats-cards";
import { UsageCharts } from "@/components/dashboard/usage-charts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { getDashboardData } from "@/app/actions/ai";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-muted-foreground italic text-sm">Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome back!</h2>
        <p className="text-muted-foreground">Here's what's happening with your AI generations today.</p>
      </div>
      
      <StatsCards 
        totalGenerations={data.stats.totalGenerations}
        totalWorkspaces={data.stats.totalWorkspaces}
        totalMembers={data.stats.totalMembers}
        usageLimit={data.stats.usageLimit}
      />
      
      <UsageCharts 
        usageData={data.usageData}
        typeData={data.typeData}
      />
      
      <ActivityFeed 
        recentActivity={data.recentActivity}
      />
    </div>
  );
}
