import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClinics } from "@/hooks/useClinics";
import { useWasteCategories } from "@/hooks/useWasteCategories";
import { useCreatePickupSchedule } from "@/hooks/usePickupSchedules";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { notifyAllAdmins } from "@/lib/notifications";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SchedulePickupDialog({ open, onOpenChange }: Props) {
  const { data: clinics } = useClinics();
  const { data: categories } = useWasteCategories();
  const createPickup = useCreatePickupSchedule();
  const { user } = useAuth();

  const [clinicId, setClinicId] = useState("");
  const [totalWeight, setTotalWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (name: string) => {
    setSelectedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !clinicId) return;

    createPickup.mutate(
      {
        clinic_id: clinicId,
        requested_by: user.id,
        waste_details: selectedCategories.map(c => ({ category: c })),
        total_weight_kg: Number(totalWeight) || 0,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          const clinicName = clinics?.find(c => c.id === clinicId)?.name || "A clinic";
          toast.success("Pickup request submitted! Management will review and schedule.");
          notifyAllAdmins({
            title: "New Pickup Request",
            message: `${clinicName} requested a pickup for ${totalWeight || 0} kg of waste.`,
            type: "alert",
            link: "/schedule-pickup",
          });
          onOpenChange(false);
          setClinicId(""); setTotalWeight(""); setNotes(""); setSelectedCategories([]);
        },
        onError: (err: any) => toast.error(err.message || "Failed to submit request"),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Schedule Waste Pickup</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Clinic *</Label>
            <Select value={clinicId} onValueChange={setClinicId}>
              <SelectTrigger><SelectValue placeholder="Select clinic" /></SelectTrigger>
              <SelectContent>
                {clinics?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Waste Categories</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {categories?.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted">
                  <Checkbox checked={selectedCategories.includes(cat.name)} onCheckedChange={() => toggleCategory(cat.name)} />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>Estimated Total Weight (kg) *</Label>
            <Input type="number" step="0.1" min="0" value={totalWeight} onChange={e => setTotalWeight(e.target.value)} required />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions..." />
          </div>
          <Button type="submit" className="w-full" disabled={createPickup.isPending || !clinicId}>
            {createPickup.isPending ? "Submitting..." : "Submit Pickup Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
