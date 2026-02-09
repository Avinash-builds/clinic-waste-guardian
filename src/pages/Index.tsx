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
  AlertCircle
} from "lucide-react";
import { useWasteRecordStats, useWasteByCategoryStats } from "@/hooks/useWasteRecords";
import { useActiveClinicCount } from "@/hooks/useClinics";
import { useRecyclingStats } from "@/hooks/useRecyclingLogs";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: wasteStats, isLoading: wasteLoading } = useWasteRecordStats();
  const { data: categoryStats, isLoading: categoryLoading } = useWasteByCategoryStats();
  const { data: clinicCount, isLoading: clinicLoading } = useActiveClinicCount();
  const { data: recyclingStats, isLoading: recyclingLoading } = useRecyclingStats();

  const isLoading = wasteLoading || categoryLoading || clinicLoading || recyclingLoading;

  // Map category stats to display format
  const categoryColorMap: Record<string, string> = {
    yellow: "yellow",
    red: "red",
    blue: "blue",
    white: "white",
    black: "sharps",
    "#F59E0B": "yellow",
    "#EF4444": "red",
    "#3B82F6": "blue",
    "#F3F4F6": "white",
    "#6B7280": "sharps",
  };

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
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </>
            ) : (
              <>
                <StatCard
                  title="Total Waste This Month"
                  value={`${(wasteStats?.totalThisMonth || 0).toFixed(1)} kg`}
                  change={wasteStats?.percentChange 
                    ? `${wasteStats.percentChange > 0 ? '+' : ''}${wasteStats.percentChange}% from last month`
                    : "No data from last month"
                  }
                  changeType={wasteStats?.percentChange && wasteStats.percentChange > 0 ? "positive" : "neutral"}
                  icon={Trash2}
                  iconColor="text-primary"
                  iconBg="bg-primary/10"
                />
                <StatCard
                  title="Recycled Waste"
                  value={`${(recyclingStats?.totalOutput || 0).toFixed(1)} kg`}
                  change={`${recyclingStats?.avgRecyclingRate || 0}% recycling rate`}
                  changeType="positive"
                  icon={Recycle}
                  iconColor="text-success"
                  iconBg="bg-success/10"
                />
                <StatCard
                  title="Active Clinics"
                  value={String(clinicCount || 0)}
                  change="Registered clinics"
                  changeType="neutral"
                  icon={Building2}
                  iconColor="text-waste-blue"
                  iconBg="bg-waste-blue-bg"
                />
                <StatCard
                  title="Pending Pickups"
                  value={String(wasteStats?.pendingPickups || 0)}
                  change={wasteStats?.pendingPickups && wasteStats.pendingPickups > 0 ? "Awaiting collection" : "All collected"}
                  changeType={wasteStats?.pendingPickups && wasteStats.pendingPickups > 0 ? "negative" : "neutral"}
                  icon={AlertCircle}
                  iconColor="text-warning"
                  iconBg="bg-warning-bg"
                />
              </>
            )}
          </div>

          {/* Waste Categories */}
          <div>
            <h2 className="font-display font-semibold text-lg text-foreground mb-4">Waste by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoryLoading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </>
              ) : categoryStats && categoryStats.length > 0 ? (
                categoryStats.slice(0, 5).map((cat) => {
                  const categoryKey = categoryColorMap[cat.color.toLowerCase()] || categoryColorMap[cat.color] || "sharps";
                  return (
                    <WasteCategoryCard
                      key={cat.name}
                      category={categoryKey as "yellow" | "red" | "blue" | "white" | "sharps"}
                      label={cat.name}
                      amount={cat.total.toFixed(1)}
                      unit="kg"
                      percentage={cat.percentage}
                    />
                  );
                })
              ) : (
                <>
                  <WasteCategoryCard category="yellow" label="Yellow (Infectious)" amount="0" unit="kg" percentage={0} />
                  <WasteCategoryCard category="red" label="Red (Contaminated)" amount="0" unit="kg" percentage={0} />
                  <WasteCategoryCard category="blue" label="Blue (Glassware)" amount="0" unit="kg" percentage={0} />
                  <WasteCategoryCard category="white" label="White (Sharps)" amount="0" unit="kg" percentage={0} />
                  <WasteCategoryCard category="sharps" label="Others" amount="0" unit="kg" percentage={0} />
                </>
              )}
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
