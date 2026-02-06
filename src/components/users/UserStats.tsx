import { Users, UserCheck, UserX, Shield } from "lucide-react";

const stats = [
  { label: "Total Users", value: "156", icon: Users, color: "text-primary" },
  { label: "Active Users", value: "142", icon: UserCheck, color: "text-green-500" },
  { label: "Inactive", value: "14", icon: UserX, color: "text-muted-foreground" },
  { label: "Admins", value: "8", icon: Shield, color: "text-purple-500" },
];

export function UserStats() {
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
