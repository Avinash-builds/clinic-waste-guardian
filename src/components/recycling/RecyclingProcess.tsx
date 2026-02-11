import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, Clock, Package, Plus } from "lucide-react";
import { useWasteCategories } from "@/hooks/useWasteCategories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRecyclingLogs } from "@/hooks/useRecyclingLogs";

const stepConfig = [
  { label: "Collection", icon: Package },
  { label: "Sorting", icon: CheckCircle },
  { label: "Processing", icon: Clock },
  { label: "Quality Check", icon: CheckCircle },
  { label: "Dispatch", icon: ArrowRight },
];

const statusToStep: Record<string, number> = {
  pending: 0,
  queued: 1,
  processing: 2,
  completed: 4,
};

export function RecyclingProcess() {
  const [open, setOpen] = useState(false);
  const { data: categories } = useWasteCategories();
  const { data: batches } = useRecyclingLogs();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    batch_number: "",
    category_id: "",
    input_weight_kg: "",
    notes: "",
  });

  const createBatch = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("recycling_logs").insert({
        batch_number: form.batch_number,
        category_id: form.category_id || null,
        input_weight_kg: Number(form.input_weight_kg) || 0,
        notes: form.notes || null,
        status: "pending",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recycling-logs"] });
      toast.success("New recycling batch created!");
      setOpen(false);
      setForm({ batch_number: "", category_id: "", input_weight_kg: "", notes: "" });
    },
    onError: (e: any) => toast.error(e.message || "Failed to create batch"),
  });

  // Get the latest active batch for the process tracker
  const activeBatch = batches?.find(b => b.status !== "completed") || batches?.[0];
  const currentStep = activeBatch ? (statusToStep[activeBatch.status || "pending"] ?? 2) : -1;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Current Process</CardTitle>
      </CardHeader>
      <CardContent>
        {activeBatch ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Tracking: <span className="font-medium text-foreground">{activeBatch.batch_number}</span>
            </p>
            <div className="space-y-4">
              {stepConfig.map((step, index) => {
                const status = index < currentStep ? "completed" : index === currentStep ? "active" : "pending";
                return (
                  <div key={step.label} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === "completed"
                          ? "bg-green-500 text-white"
                          : status === "active"
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">{status}</p>
                    </div>
                    {index < stepConfig.length - 1 && (
                      <div className={`w-px h-8 ${status === "completed" ? "bg-green-500" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">No active batches. Start a new one below.</p>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Start New Batch
          </Button>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Create Recycling Batch</DialogTitle>
          </DialogHeader>
          <form onSubmit={e => { e.preventDefault(); createBatch.mutate(); }} className="space-y-4">
            <div>
              <Label>Batch Number *</Label>
              <Input value={form.batch_number} onChange={e => setForm(p => ({ ...p, batch_number: e.target.value }))} placeholder="e.g. RCY-2026-001" required />
            </div>
            <div>
              <Label>Waste Category</Label>
              <Select value={form.category_id} onValueChange={v => setForm(p => ({ ...p, category_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories?.filter(c => c.is_recyclable).map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Input Weight (kg) *</Label>
              <Input type="number" step="0.1" min="0" value={form.input_weight_kg} onChange={e => setForm(p => ({ ...p, input_weight_kg: e.target.value }))} required />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={createBatch.isPending || !form.batch_number}>
              {createBatch.isPending ? "Creating..." : "Create Batch"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
