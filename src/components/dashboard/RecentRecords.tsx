import { cn } from "@/lib/utils";
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWasteRecords } from "@/hooks/useWasteRecords";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const categoryColorMap: Record<string, string> = {
  yellow: 'yellow',
  red: 'red',
  blue: 'blue',
  white: 'white',
  black: 'sharps',
};

const statusStyles = {
  pending: 'bg-warning-bg text-warning',
  collected: 'bg-blue-100 text-blue-700',
  processed: 'bg-success-bg text-success',
};

export function RecentRecords() {
  const { data: records, isLoading, error } = useWasteRecords(5);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden animate-slide-up">
        <div className="p-6 border-b border-border">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <p className="text-destructive">Failed to load waste records</p>
      </div>
    );
  }

  const isEmpty = !records || records.length === 0;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-slide-up">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">Recent Waste Records</h3>
          <p className="text-sm text-muted-foreground">Latest disposal entries from all clinics</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/waste-entry")}>View All</Button>
      </div>
      
      {isEmpty ? (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No waste records yet. Add your first entry!</p>
          <Button 
            className="mt-4 bg-primary hover:bg-primary/90" 
            onClick={() => navigate("/waste-entry")}
          >
            Add Waste Entry
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="rounded-tl-lg">Record ID</th>
                <th>Clinic</th>
                <th>Category</th>
                <th>Weight</th>
                <th>Date</th>
                <th>Status</th>
                <th className="rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((record) => {
                const colorCode = record.waste_categories?.color_code?.toLowerCase() || 'sharps';
                const categoryClass = categoryColorMap[colorCode] || 'sharps';
                const status = (record.status || 'pending') as keyof typeof statusStyles;
                
                return (
                  <tr key={record.id} className="transition-colors">
                    <td className="font-mono text-sm font-medium">{record.id.slice(0, 8).toUpperCase()}</td>
                    <td className="font-medium">{record.clinics?.name || "Unknown"}</td>
                    <td>
                      <span className={cn("waste-badge", `waste-badge-${categoryClass}`)}>
                        {record.waste_categories?.name || "Unknown"}
                      </span>
                    </td>
                    <td>{Number(record.weight_kg).toFixed(1)} kg</td>
                    <td className="text-muted-foreground">
                      {format(new Date(record.recorded_at), "MMM dd, yyyy")}
                    </td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                        statusStyles[status] || statusStyles.pending
                      )}>
                        {record.status || "pending"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
