import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AddClinicDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "", address: "", city: "", state: "", pincode: "",
    contact_person: "", phone: "", email: "", license_number: "",
    compliance_status: "pending",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("clinics").insert({
        name: form.name,
        address: form.address || null,
        city: form.city || null,
        state: form.state || null,
        pincode: form.pincode || null,
        contact_person: form.contact_person || null,
        phone: form.phone || null,
        email: form.email || null,
        license_number: form.license_number || null,
        compliance_status: form.compliance_status,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      toast.success("Clinic added successfully");
      setOpen(false);
      setForm({ name: "", address: "", city: "", state: "", pincode: "", contact_person: "", phone: "", email: "", license_number: "", compliance_status: "pending" });
    },
    onError: (e: any) => toast.error(e.message || "Failed to add clinic"),
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Clinic
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Register New Clinic</DialogTitle>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          <div>
            <Label>Clinic Name *</Label>
            <Input value={form.name} onChange={e => update("name", e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Contact Person</Label><Input value={form.contact_person} onChange={e => update("contact_person", e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => update("phone", e.target.value)} /></div>
          </div>
          <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => update("email", e.target.value)} /></div>
          <div><Label>Address</Label><Input value={form.address} onChange={e => update("address", e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>City</Label><Input value={form.city} onChange={e => update("city", e.target.value)} /></div>
            <div><Label>State</Label><Input value={form.state} onChange={e => update("state", e.target.value)} /></div>
            <div><Label>Pincode</Label><Input value={form.pincode} onChange={e => update("pincode", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>License Number</Label><Input value={form.license_number} onChange={e => update("license_number", e.target.value)} /></div>
            <div>
              <Label>Compliance Status</Label>
              <Select value={form.compliance_status} onValueChange={v => update("compliance_status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending || !form.name}>
            {mutation.isPending ? "Adding..." : "Add Clinic"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
