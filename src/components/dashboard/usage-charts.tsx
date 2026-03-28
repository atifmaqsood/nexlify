"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const usageData = [
  { day: "01", count: 42 },
  { day: "05", count: 128 },
  { day: "10", count: 86 },
  { day: "15", count: 154 },
  { day: "20", count: 210 },
  { day: "25", count: 180 },
  { day: "30", count: 245 },
];

const typeData = [
  { name: "Blog Posts", count: 450, color: "#6366F1" },
  { name: "Emails", count: 320, color: "#8B5CF6" },
  { name: "Social Media", count: 280, color: "#10B981" },
  { name: "Product", count: 180, color: "#F59E0B" },
];

export function UsageCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Usage Over Time */}
      <Card className="bg-card border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            AI Usage (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#111827", 
                  borderColor: "#1F2937",
                  borderRadius: "8px",
                  color: "#F9FAFB"
                }}
                itemStyle={{ color: "#6366F1" }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#6366F1" 
                strokeWidth={3} 
                dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Generations by Type */}
      <Card className="bg-card border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Generations by Type
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#111827", 
                  borderColor: "#1F2937",
                  borderRadius: "8px",
                  color: "#F9FAFB"
                }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
