import { BarChart3, TrendingUp, Scale, Leaf } from "lucide-react";
import { useWasteRecordStats } from "@/hooks/useWasteRecords";
import { useRecyclingStats } from "@/hooks/useRecyclingLogs";
import { useClinics } from "@/hooks/useClinics";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsOverview() {
  const { data: wasteStats, isLoading: wasteLoading } = useWasteRecordStats();
  const { data: recyclingStats, isLoading: recyclingLoading } = useRecyclingStats();
  const { data: clinics, isLoading: clinicsLoading } = useClinics();

  const isLoading = wasteLoading || recyclingLoading || clinicsLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const compliantClinics = clinics?.filter(c => c.compliance_status === "compliant").length || 0;
  const totalClinics = clinics?.length || 1;
  const complianceRate = Math.round((compliantClinics / totalClinics) * 100);

  const metrics = [
    { 
      label: "Total Waste This Month", 
      value: `${(wasteStats?.totalThisMonth || 0).toFixed(1)} kg`, 
      change: wasteStats?.percentChange ? `${wasteStats.percentChange > 0 ? '+' : ''}${wasteStats.percentChange}%` : "N/A", 
      icon: Scale, 
      trend: (wasteStats?.percentChange || 0) > 0 ? "up" : "down" 
    },
    { 
      label: "Recycling Rate", 
      value: `${recyclingStats?.avgRecyclingRate || 0}%`, 
      change: recyclingStats?.avgRecyclingRate && recyclingStats.avgRecyclingRate > 50 ? "+Good" : "Needs work", 
      icon: Leaf, 
      trend: "up" 
    },
    { 
      label: "Total Recycled", 
      value: `${(recyclingStats?.totalOutput || 0).toFixed(1)} kg`, 
      change: `${recyclingStats?.completedCount || 0} batches`, 
      icon: TrendingUp, 
      trend: "up" 
    },
    { 
      label: "Compliance Score", 
      value: `${complianceRate}%`, 
      change: `${compliantClinics}/${totalClinics} clinics`, 
      icon: BarChart3, 
      trend: complianceRate >= 80 ? "up" : "down" 
    },
  ];

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
            <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-500" : "text-muted-foreground"}`}>
              {metric.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{metric.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
