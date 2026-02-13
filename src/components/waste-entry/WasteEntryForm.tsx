import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useClinics } from "@/hooks/useClinics";
import { useWasteCategories } from "@/hooks/useWasteCategories";
import { useCreateWasteRecord } from "@/hooks/useWasteRecords";
import { useAuth } from "@/hooks/useAuth";
import { notifyAllAdmins } from "@/lib/notifications";
import { Loader2 } from "lucide-react";

const colorClassMap: Record<string, string> = {
  yellow: "bg-waste-yellow",
  red: "bg-waste-red",
  blue: "bg-waste-blue",
  white: "bg-waste-white border",
  black: "bg-waste-sharps",
  "#F59E0B": "bg-waste-yellow",
  "#EF4444": "bg-waste-red",
  "#3B82F6": "bg-waste-blue",
  "#F3F4F6": "bg-waste-white border",
  "#6B7280": "bg-waste-sharps",
};

export function WasteEntryForm() {
  const [categoryId, setCategoryId] = useState("");
  const [weight, setWeight] = useState("");
  const [clinicId, setClinicId] = useState("");
  const [notes, setNotes] = useState("");

  const { data: clinics, isLoading: clinicsLoading } = useClinics();
  const { data: categories, isLoading: categoriesLoading } = useWasteCategories();
  const createWasteRecord = useCreateWasteRecord();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId || !weight || !clinicId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to submit waste entries");
      return;
    }

    try {
      await createWasteRecord.mutateAsync({
        category_id: categoryId,
        clinic_id: clinicId,
        weight_kg: parseFloat(weight),
        notes: notes || null,
        recorded_by: user.id,
        status: "pending",
      });
      
      const selectedClinic = clinics?.find(c => c.id === clinicId);
      const selectedCategory = categories?.find(c => c.id === categoryId);
      
      toast.success("Waste entry recorded successfully!");
      
      notifyAllAdmins({
        title: "New Waste Entry",
        message: `${selectedClinic?.name || "A clinic"} recorded ${weight} kg of ${selectedCategory?.name || "waste"}.`,
        type: "info",
        link: "/waste-entry",
      });

      setCategoryId("");
      setWeight("");
      setClinicId("");
      setNotes("");
    } catch (error: any) {
      toast.error(error.message || "Failed to record waste entry");
    }
  };

  const getColorClass = (colorCode: string) => {
    return colorClassMap[colorCode.toLowerCase()] || colorClassMap[colorCode] || "bg-muted";
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">New Waste Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinic">Clinic *</Label>
            <Select value={clinicId} onValueChange={setClinicId} disabled={clinicsLoading}>
              <SelectTrigger>
                <SelectValue placeholder={clinicsLoading ? "Loading clinics..." : "Select clinic"} />
              </SelectTrigger>
              <SelectContent>
                {clinics?.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Waste Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={categoriesLoading}>
              <SelectTrigger>
                <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select category"} />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getColorClass(cat.color_code)}`} />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={createWasteRecord.isPending}
          >
            {createWasteRecord.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Recording...
              </>
            ) : (
              "Record Entry"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
