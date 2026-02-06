import { Recycle, TrendingUp, Package, CheckCircle } from "lucide-react";

const stats = [
  { label: "Total Recycled", value: "2,456 kg", change: "+12%", icon: Recycle, color: "text-primary" },
  { label: "Recycling Rate", value: "78.5%", change: "+5.2%", icon: TrendingUp, color: "text-green-500" },
  { label: "Active Batches", value: "24", change: "+3", icon: Package, color: "text-blue-500" },
  { label: "Completed Today", value: "8", change: "+2", icon: CheckCircle, color: "text-purple-500" },
];

export function RecyclingStats() {
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
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              <p className="text-sm text-green-500 mt-1">{stat.change}</p>
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
