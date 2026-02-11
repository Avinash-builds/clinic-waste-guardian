import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRecyclingLogs } from "@/hooks/useRecyclingLogs";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Edit2 } from "lucide-react";

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
  const queryClient = useQueryClient();
  const [editBatch, setEditBatch] = useState<any>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editOutput, setEditOutput] = useState("");

  const updateBatch = useMutation({
    mutationFn: async () => {
      if (!editBatch) return;
      const outputKg = Number(editOutput) || 0;
      const inputKg = Number(editBatch.input_weight_kg) || 1;
      const rate = Math.round((outputKg / inputKg) * 100);

      const { error } = await supabase
        .from("recycling_logs")
        .update({
          status: editStatus,
          output_weight_kg: outputKg || null,
          recycling_rate: rate || null,
          processing_date: editStatus === "completed" ? new Date().toISOString() : editBatch.processing_date,
        })
        .eq("id", editBatch.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recycling-logs"] });
      toast.success("Batch updated!");
      setEditBatch(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader><CardTitle className="font-display">Active Batches</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="animate-slide-up">
        <CardHeader><CardTitle className="font-display">Active Batches</CardTitle></CardHeader>
        <CardContent><p className="text-destructive text-center">Failed to load batches</p></CardContent>
      </Card>
    );
  }

  const isEmpty = !batches || batches.length === 0;

  return (
    <Card className="animate-slide-up">
      <CardHeader><CardTitle className="font-display">Active Batches</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {isEmpty ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recycling batches yet. Start a new batch from the right panel.</p>
          </div>
        ) : (
          batches.map((batch) => {
            const progress = batch.recycling_rate ? Number(batch.recycling_rate) : 0;
            return (
              <div key={batch.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{batch.batch_number}</p>
                    <p className="text-sm text-muted-foreground">{batch.waste_categories?.name || "Unknown Category"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(batch.status)}>{batch.status}</Badge>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                      setEditBatch(batch);
                      setEditStatus(batch.status || "pending");
                      setEditOutput(String(batch.output_weight_kg || ""));
                    }}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Input: {Number(batch.input_weight_kg || 0).toFixed(1)} kg → Output: {Number(batch.output_weight_kg || 0).toFixed(1)} kg</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })
        )}
      </CardContent>

      <Dialog open={!!editBatch} onOpenChange={() => setEditBatch(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="font-display">Update Batch</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Output Weight (kg)</Label>
              <Input type="number" step="0.1" min="0" value={editOutput} onChange={e => setEditOutput(e.target.value)} />
            </div>
            <Button onClick={() => updateBatch.mutate()} className="w-full" disabled={updateBatch.isPending}>
              {updateBatch.isPending ? "Updating..." : "Update Batch"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
