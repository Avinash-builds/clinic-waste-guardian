import { Building2, CheckCircle, AlertTriangle, Clock } from "lucide-react";

const stats = [
  { label: "Total Clinics", value: "48", icon: Building2, color: "text-primary" },
  { label: "Compliant", value: "42", icon: CheckCircle, color: "text-green-500" },
  { label: "Pending Review", value: "4", icon: Clock, color: "text-yellow-500" },
  { label: "Non-Compliant", value: "2", icon: AlertTriangle, color: "text-red-500" },
];

export function ClinicStats() {
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
