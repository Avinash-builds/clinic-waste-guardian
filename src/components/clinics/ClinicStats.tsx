import { Building2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useClinics } from "@/hooks/useClinics";
import { Skeleton } from "@/components/ui/skeleton";

export function ClinicStats() {
  const { data: clinics, isLoading } = useClinics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const compliantCount = clinics?.filter(c => c.compliance_status === "compliant").length || 0;
  const pendingCount = clinics?.filter(c => c.compliance_status === "pending").length || 0;
  const nonCompliantCount = clinics?.filter(c => c.compliance_status === "non-compliant").length || 0;

  const stats = [
    { label: "Total Clinics", value: String(clinics?.length || 0), icon: Building2, color: "text-primary" },
    { label: "Compliant", value: String(compliantCount), icon: CheckCircle, color: "text-green-500" },
    { label: "Pending Review", value: String(pendingCount), icon: AlertTriangle, color: "text-yellow-500" },
    { label: "Non-Compliant", value: String(nonCompliantCount), icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl border border-border p-6 animate-slide-up"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
