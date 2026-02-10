import { Truck, Clock } from "lucide-react";
import { usePickupSchedules } from "@/hooks/usePickupSchedules";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  pending: "text-yellow-600",
  verified: "text-blue-600",
  scheduled: "text-green-600",
  completed: "text-muted-foreground",
};

export function UpcomingPickups() {
  const { data: pickups, isLoading } = usePickupSchedules();

  const upcoming = pickups
    ?.filter(p => p.status === "pending" || p.status === "scheduled")
    .slice(0, 3);

  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">Upcoming Pickups</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          {upcoming?.length || 0} pending
        </span>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          [1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
        ) : !upcoming || upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No upcoming pickups</p>
        ) : (
          upcoming.map((pickup) => (
            <div key={pickup.id} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{pickup.clinics?.name || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{Number(pickup.total_weight_kg).toFixed(1)} kg</p>
                  </div>
                </div>
                <Badge variant="outline" className={statusStyles[pickup.status]}>
                  {pickup.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pickup.scheduled_date ? new Date(pickup.scheduled_date).toLocaleDateString() : "Pending schedule"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(pickup.waste_details as any[])?.map((d: any, i: number) => (
                    <span key={i} className={`waste-badge waste-badge-${d.category?.toLowerCase()}`}>
                      {d.category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
