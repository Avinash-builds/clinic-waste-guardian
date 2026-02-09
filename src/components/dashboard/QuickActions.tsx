import { Plus, FileText, Truck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function QuickActions() {
  const navigate = useNavigate();

  const handleNewWasteEntry = () => {
    navigate("/waste-entry");
  };

  const handleGenerateReport = () => {
    navigate("/analytics");
    toast.info("Navigate to Analytics for reports and insights");
  };

  const handleSchedulePickup = () => {
    toast.info("Pickup scheduling feature coming soon!");
  };

  const handleReportIssue = () => {
    navigate("/notifications");
    toast.info("Report your issue through notifications");
  };

  const actions = [
    { icon: Plus, label: 'New Waste Entry', color: 'bg-success hover:bg-success/90 text-white', onClick: handleNewWasteEntry },
    { icon: FileText, label: 'Generate Report', color: 'bg-waste-blue hover:bg-waste-blue/90 text-white', onClick: handleGenerateReport },
    { icon: Truck, label: 'Schedule Pickup', color: 'bg-success hover:bg-success/90 text-white', onClick: handleSchedulePickup },
    { icon: AlertTriangle, label: 'Report Issue', color: 'bg-warning hover:bg-warning/90 text-white', onClick: handleReportIssue },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
      <h3 className="font-display font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            className={`h-auto py-4 flex flex-col items-center gap-2 ${action.color}`}
            onClick={action.onClick}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
