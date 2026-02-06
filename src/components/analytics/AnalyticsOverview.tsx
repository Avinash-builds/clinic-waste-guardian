import { BarChart3, TrendingUp, Scale, Leaf } from "lucide-react";

const metrics = [
  { label: "Total Waste This Month", value: "8,456 kg", change: "+8.2%", icon: Scale, trend: "up" },
  { label: "Recycling Rate", value: "82.4%", change: "+3.1%", icon: Leaf, trend: "up" },
  { label: "Cost Savings", value: "$12,450", change: "+15%", icon: TrendingUp, trend: "up" },
  { label: "Compliance Score", value: "98.5%", change: "+0.5%", icon: BarChart3, trend: "up" },
];

export function AnalyticsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-card rounded-xl border border-border p-6 animate-slide-up"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <metric.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-green-500 font-medium">{metric.change}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{metric.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
