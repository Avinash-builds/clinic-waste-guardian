import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { WasteCategoryCard } from "@/components/dashboard/WasteCategoryCard";
import { RecentRecords } from "@/components/dashboard/RecentRecords";
import { WasteChart } from "@/components/dashboard/WasteChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingPickups } from "@/components/dashboard/UpcomingPickups";
import { 
  Trash2, 
  Recycle, 
  Building2, 
  TrendingUp,
  AlertCircle
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Title */}
          <div className="animate-fade-in">
            <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your waste management overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Waste This Month"
              value="847.5 kg"
              change="+12.5% from last month"
              changeType="positive"
              icon={Trash2}
              iconColor="text-primary"
              iconBg="bg-primary/10"
            />
            <StatCard
              title="Recycled Waste"
              value="523.2 kg"
              change="61.7% recycling rate"
              changeType="positive"
              icon={Recycle}
              iconColor="text-success"
              iconBg="bg-success/10"
            />
            <StatCard
              title="Active Clinics"
              value="24"
              change="3 new this month"
              changeType="neutral"
              icon={Building2}
              iconColor="text-waste-blue"
              iconBg="bg-waste-blue-bg"
            />
            <StatCard
              title="Pending Pickups"
              value="8"
              change="2 urgent"
              changeType="negative"
              icon={AlertCircle}
              iconColor="text-warning"
              iconBg="bg-warning-bg"
            />
          </div>

          {/* Waste Categories */}
          <div>
            <h2 className="font-display font-semibold text-lg text-foreground mb-4">Waste by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <WasteCategoryCard
                category="yellow"
                label="Yellow (Infectious)"
                amount="245.8"
                unit="kg"
                percentage={29}
              />
              <WasteCategoryCard
                category="red"
                label="Red (Contaminated)"
                amount="186.2"
                unit="kg"
                percentage={22}
              />
              <WasteCategoryCard
                category="blue"
                label="Blue (Glassware)"
                amount="212.5"
                unit="kg"
                percentage={25}
              />
              <WasteCategoryCard
                category="white"
                label="White (Sharps)"
                amount="118.4"
                unit="kg"
                percentage={14}
              />
              <WasteCategoryCard
                category="sharps"
                label="Others"
                amount="84.6"
                unit="kg"
                percentage={10}
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <WasteChart />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <QuickActions />
              <UpcomingPickups />
            </div>
          </div>

          {/* Recent Records */}
          <RecentRecords />
        </div>
      </main>
    </div>
  );
};

export default Index;
