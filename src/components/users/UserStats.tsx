import { Users, UserCheck, UserCog, Shield } from "lucide-react";
import { useProfileStats } from "@/hooks/useProfiles";
import { Skeleton } from "@/components/ui/skeleton";

export function UserStats() {
  const { data: stats, isLoading } = useProfileStats();

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
    { label: "Total Users", value: String(stats?.total || 0), icon: Users, color: "text-primary" },
    { label: "Administrators", value: String(stats?.admins || 0), icon: Shield, color: "text-purple-500" },
    { label: "Moderators", value: String(stats?.moderators || 0), icon: UserCog, color: "text-blue-500" },
    { label: "Clinic Staff", value: String(stats?.staff || 0), icon: UserCheck, color: "text-green-500" },
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
              <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
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
