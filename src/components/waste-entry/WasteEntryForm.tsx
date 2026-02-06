import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const wasteCategories = [
  { value: "yellow", label: "Yellow - Infectious Waste", color: "bg-waste-yellow" },
  { value: "red", label: "Red - Contaminated Recyclables", color: "bg-waste-red" },
  { value: "blue", label: "Blue - Pharmaceutical Waste", color: "bg-waste-blue" },
  { value: "white", label: "White - Sharp Objects", color: "bg-waste-white border" },
  { value: "sharps", label: "Sharps/Others", color: "bg-waste-sharps" },
];

export function WasteEntryForm() {
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [clinic, setClinic] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Waste entry recorded successfully!");
    setCategory("");
    setWeight("");
    setClinic("");
    setNotes("");
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">New Waste Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinic">Clinic</Label>
            <Select value={clinic} onValueChange={setClinic}>
              <SelectTrigger>
                <SelectValue placeholder="Select clinic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city-clinic">City Health Clinic</SelectItem>
                <SelectItem value="metro-hospital">Metro General Hospital</SelectItem>
                <SelectItem value="sunrise-diagnostics">Sunrise Diagnostics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Waste Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {wasteCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
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

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Record Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
