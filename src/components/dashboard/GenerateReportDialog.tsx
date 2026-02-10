import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateReportDialog({ open, onOpenChange }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select date range");
      return;
    }
    setGenerating(true);
    try {
      // Fetch waste records
      const { data: wasteRecords, error: wErr } = await supabase
        .from("waste_records")
        .select(`*, clinics (name), waste_categories (name, color_code)`)
        .gte("recorded_at", new Date(startDate).toISOString())
        .lte("recorded_at", new Date(endDate + "T23:59:59").toISOString())
        .order("recorded_at", { ascending: false });
      if (wErr) throw wErr;

      // Fetch pickup schedules
      const { data: pickups, error: pErr } = await supabase
        .from("pickup_schedules")
        .select(`*, clinics (name)`)
        .gte("created_at", new Date(startDate).toISOString())
        .lte("created_at", new Date(endDate + "T23:59:59").toISOString())
        .order("created_at", { ascending: false });
      if (pErr) throw pErr;

      // Generate PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("BioWaste Management Report", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Period: ${startDate} to ${endDate}`, pageWidth / 2, 28, { align: "center" });
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 34, { align: "center" });

      // Summary stats
      const totalWeight = wasteRecords?.reduce((s, r) => s + Number(r.weight_kg), 0) || 0;
      const categoryTotals: Record<string, number> = {};
      wasteRecords?.forEach(r => {
        const cat = r.waste_categories?.name || "Unknown";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(r.weight_kg);
      });

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 14, 46);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Records: ${wasteRecords?.length || 0}`, 14, 54);
      doc.text(`Total Weight: ${totalWeight.toFixed(2)} kg`, 14, 60);
      doc.text(`Pickup Requests: ${pickups?.length || 0}`, 14, 66);

      let yPos = 76;

      // Category breakdown
      if (Object.keys(categoryTotals).length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Category Breakdown", 14, yPos);
        yPos += 4;
        autoTable(doc, {
          startY: yPos,
          head: [["Category", "Weight (kg)", "Percentage"]],
          body: Object.entries(categoryTotals).map(([cat, weight]) => [
            cat,
            weight.toFixed(2),
            `${((weight / totalWeight) * 100).toFixed(1)}%`,
          ]),
          theme: "grid",
          headStyles: { fillColor: [59, 130, 246] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 12;
      }

      // Waste Records Table
      if (wasteRecords && wasteRecords.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Waste Entry Details", 14, yPos);
        yPos += 4;
        autoTable(doc, {
          startY: yPos,
          head: [["Date", "Clinic", "Category", "Weight (kg)", "Status"]],
          body: wasteRecords.map(r => [
            new Date(r.recorded_at).toLocaleDateString(),
            r.clinics?.name || "N/A",
            r.waste_categories?.name || "N/A",
            Number(r.weight_kg).toFixed(2),
            r.status || "pending",
          ]),
          theme: "grid",
          headStyles: { fillColor: [34, 197, 94] },
        });
        yPos = (doc as any).lastAutoTable.finalY + 12;
      }

      // Pickup Schedules Table
      if (pickups && pickups.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Pickup Schedules", 14, yPos);
        yPos += 4;
        autoTable(doc, {
          startY: yPos,
          head: [["Requested", "Clinic", "Weight (kg)", "Status", "Scheduled Date"]],
          body: pickups.map(p => [
            new Date(p.created_at).toLocaleDateString(),
            p.clinics?.name || "N/A",
            Number(p.total_weight_kg).toFixed(2),
            p.status,
            p.scheduled_date ? new Date(p.scheduled_date).toLocaleDateString() : "Pending",
          ]),
          theme: "grid",
          headStyles: { fillColor: [234, 179, 8] },
        });
      }

      doc.save(`BioWaste_Report_${startDate}_to_${endDate}.pdf`);
      toast.success("Report downloaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Generate Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <Button onClick={handleGenerate} className="w-full" disabled={generating}>
            {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {generating ? "Generating..." : "Download PDF Report"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
