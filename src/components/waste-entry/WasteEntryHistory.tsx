import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWasteRecords } from "@/hooks/useWasteRecords";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  collected: "bg-blue-100 text-blue-800",
  processed: "bg-green-100 text-green-800",
};

export function WasteEntryHistory() {
  const { data: records, isLoading, error } = useWasteRecords(10);

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center">Failed to load entries</p>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = !records || records.length === 0;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Recent Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No entries recorded yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Submit your first waste entry using the form.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div 
                key={record.id} 
                className="p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {record.clinics?.name || "Unknown Clinic"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.waste_categories?.name || "Unknown Category"} • {Number(record.weight_kg).toFixed(1)} kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(record.recorded_at), "MMM dd, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Badge className={statusStyles[record.status || "pending"]}>
                    {record.status || "pending"}
                  </Badge>
                </div>
                {record.notes && (
                  <p className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border">
                    {record.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
