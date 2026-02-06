import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure system preferences and options</p>
          </div>
          
          <SettingsTabs />
        </main>
      </div>
    </div>
  );
};

export default Settings;
