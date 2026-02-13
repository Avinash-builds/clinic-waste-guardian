import { Bell, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";

export function Header() {
  const navigate = useNavigate();
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search clinics, records..." 
          className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{today}</span>
        </div>

        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/notifications")}>
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-destructive rounded-full text-[10px] font-bold text-destructive-foreground flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>

        <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate("/waste-entry")}>
          + New Entry
        </Button>
      </div>
    </header>
  );
}
