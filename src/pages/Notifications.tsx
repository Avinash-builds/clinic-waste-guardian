import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { NotificationsList } from "@/components/notifications/NotificationsList";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">Alerts, reminders, and system notifications</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <NotificationFilters />
            </div>
            <div className="lg:col-span-3">
              <NotificationsList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
