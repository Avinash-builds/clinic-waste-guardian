import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, Info, X } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const getTypeIcon = (type: string | null) => {
  const icons: Record<string, React.ElementType> = {
    alert: AlertTriangle,
    reminder: Clock,
    completed: CheckCircle,
    info: Info,
  };
  return icons[type || "info"] || Info;
};

const getTypeColor = (type: string | null) => {
  const colors: Record<string, string> = {
    alert: "text-red-500 bg-red-100",
    reminder: "text-yellow-500 bg-yellow-100",
    completed: "text-green-500 bg-green-100",
    info: "text-blue-500 bg-blue-100",
  };
  return colors[type || "info"] || "text-muted-foreground bg-muted";
};

export function NotificationsList() {
  const { data: notifications, isLoading, error } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display">Recent Notifications</CardTitle>
          <Skeleton className="h-8 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center">Failed to load notifications</p>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = !notifications || notifications.length === 0;

  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display">Recent Notifications</CardTitle>
        {!isEmpty && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            Mark All Read
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEmpty ? (
          <div className="text-center py-8">
            <Info className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              You'll see alerts and reminders here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getTypeIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.is_read ? "bg-background" : "bg-primary/5 border-primary/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{notification.title}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => markRead.mutate(notification.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                      {!notification.is_read && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
