import { Recycle, Scale, Clock, CheckCircle } from "lucide-react";
import { useRecyclingStats } from "@/hooks/useRecyclingLogs";
import { Skeleton } from "@/components/ui/skeleton";

export function RecyclingStats() {
  const { data: stats, isLoading } = useRecyclingStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Input", 
      value: `${(stats?.totalInput || 0).toFixed(1)} kg`, 
      icon: Scale, 
      color: "text-primary" 
    },
    { 
      label: "Total Output", 
      value: `${(stats?.totalOutput || 0).toFixed(1)} kg`, 
      icon: Recycle, 
      color: "text-green-500" 
    },
    { 
      label: "Processing", 
      value: String(stats?.processingCount || 0), 
      icon: Clock, 
      color: "text-yellow-500" 
    },
    { 
      label: "Completed", 
      value: String(stats?.completedCount || 0), 
      icon: CheckCircle, 
      color: "text-purple-500" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl border border-border p-6 animate-slide-up"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
