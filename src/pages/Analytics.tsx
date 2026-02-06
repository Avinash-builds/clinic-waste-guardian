import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { WasteTrendsChart } from "@/components/analytics/WasteTrendsChart";
import { CategoryBreakdown } from "@/components/analytics/CategoryBreakdown";
import { AIInsights } from "@/components/analytics/AIInsights";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground">Data-driven insights for waste management</p>
          </div>
          
          <AnalyticsOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <WasteTrendsChart />
            </div>
            <CategoryBreakdown />
          </div>
          
          <div className="mt-6">
            <AIInsights />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
