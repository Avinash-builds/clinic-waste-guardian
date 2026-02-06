import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const batches = [
  { id: "RB-001", type: "Plastic (Blue)", weight: "45.2 kg", progress: 85, status: "processing" },
  { id: "RB-002", type: "Metal (Red)", weight: "23.8 kg", progress: 60, status: "processing" },
  { id: "RB-003", type: "Glass (White)", weight: "18.5 kg", progress: 100, status: "completed" },
  { id: "RB-004", type: "Paper (Yellow)", weight: "32.1 kg", progress: 30, status: "queued" },
  { id: "RB-005", type: "Mixed Materials", weight: "12.7 kg", progress: 0, status: "pending" },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    queued: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };
  return colors[status] || "bg-muted";
};

export function RecyclingBatches() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Active Batches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {batches.map((batch) => (
          <div key={batch.id} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">{batch.id}</p>
                <p className="text-sm text-muted-foreground">{batch.type}</p>
              </div>
              <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Weight: {batch.weight}</span>
              <span className="text-muted-foreground">{batch.progress}%</span>
            </div>
            <Progress value={batch.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
