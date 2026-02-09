import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRecyclingLogs } from "@/hooks/useRecyclingLogs";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusColor = (status: string | null) => {
  const colors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    queued: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };
  return colors[status || "pending"] || "bg-muted";
};

export function RecyclingBatches() {
  const { data: batches, isLoading, error } = useRecyclingLogs();

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Active Batches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Active Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center">Failed to load batches</p>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = !batches || batches.length === 0;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Active Batches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEmpty ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recycling batches yet.</p>
          </div>
        ) : (
          batches.map((batch) => {
            const progress = batch.recycling_rate ? Number(batch.recycling_rate) : 0;
            
            return (
              <div key={batch.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{batch.batch_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {batch.waste_categories?.name || "Unknown Category"}
                    </p>
                  </div>
                  <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Input: {Number(batch.input_weight_kg || 0).toFixed(1)} kg
                  </span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
