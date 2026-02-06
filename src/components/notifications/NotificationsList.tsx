import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, Info, X } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "Storage Limit Warning",
    message: "City Health Clinic is approaching 90% storage capacity for yellow waste.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "reminder",
    title: "Scheduled Pickup Tomorrow",
    message: "Metro General Hospital has a scheduled pickup at 9:00 AM.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "completed",
    title: "Batch Processing Complete",
    message: "Recycling batch RB-003 has been successfully processed.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "alert",
    title: "Compliance Review Required",
    message: "Central Medical Center requires compliance documentation update.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 5,
    type: "info",
    title: "New Clinic Registered",
    message: "Wellness Family Clinic has been added to the system.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 6,
    type: "reminder",
    title: "Monthly Report Due",
    message: "January disposal summary report is due in 3 days.",
    time: "1 day ago",
    read: true,
  },
];

const getTypeIcon = (type: string) => {
  const icons: Record<string, React.ElementType> = {
    alert: AlertTriangle,
    reminder: Clock,
    completed: CheckCircle,
    info: Info,
  };
  return icons[type] || Info;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    alert: "text-red-500 bg-red-100",
    reminder: "text-yellow-500 bg-yellow-100",
    completed: "text-green-500 bg-green-100",
    info: "text-blue-500 bg-blue-100",
  };
  return colors[type] || "text-muted-foreground bg-muted";
};

export function NotificationsList() {
  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display">Recent Notifications</CardTitle>
        <Button variant="outline" size="sm">
          Mark All Read
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => {
          const Icon = getTypeIcon(notification.type);
          return (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? "bg-background" : "bg-primary/5 border-primary/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{notification.title}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                    {!notification.read && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
