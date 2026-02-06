import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Clock, CheckCircle, Info } from "lucide-react";

const filters = [
  { label: "All", icon: Bell, count: 24, active: true },
  { label: "Alerts", icon: AlertTriangle, count: 5, active: false },
  { label: "Reminders", icon: Clock, count: 8, active: false },
  { label: "Completed", icon: CheckCircle, count: 6, active: false },
  { label: "Info", icon: Info, count: 5, active: false },
];

export function NotificationFilters() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display text-lg">Filter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {filters.map((filter) => (
          <Button
            key={filter.label}
            variant={filter.active ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <filter.icon className="w-4 h-4 mr-2" />
            <span className="flex-1 text-left">{filter.label}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{filter.count}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
