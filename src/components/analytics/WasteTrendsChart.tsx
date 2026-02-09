import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useWasteRecords } from "@/hooks/useWasteRecords";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export function WasteTrendsChart() {
  const { data: records, isLoading } = useWasteRecords();

  const chartData = useMemo(() => {
    if (!records || records.length === 0) {
      // Return empty month data for the last 6 months
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        months.push({
          month: format(date, "MMM"),
          yellow: 0,
          red: 0,
          blue: 0,
        });
      }
      return months;
    }

    // Group records by month
    const monthlyData: Record<string, Record<string, number>> = {};
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, "MMM");
      monthlyData[monthKey] = { yellow: 0, red: 0, blue: 0 };
    }

    records.forEach((record) => {
      const recordDate = new Date(record.recorded_at);
      const monthKey = format(recordDate, "MMM");
      
      if (monthlyData[monthKey]) {
        const colorCode = record.waste_categories?.color_code?.toLowerCase() || "";
        const weight = Number(record.weight_kg);
        
        if (colorCode.includes("yellow") || colorCode === "#f59e0b") {
          monthlyData[monthKey].yellow += weight;
        } else if (colorCode.includes("red") || colorCode === "#ef4444") {
          monthlyData[monthKey].red += weight;
        } else if (colorCode.includes("blue") || colorCode === "#3b82f6") {
          monthlyData[monthKey].blue += weight;
        }
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      yellow: Math.round(data.yellow * 10) / 10,
      red: Math.round(data.red * 10) / 10,
      blue: Math.round(data.blue * 10) / 10,
    }));
  }, [records]);

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Monthly Waste Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Monthly Waste Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorYellowTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRedTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBlueTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(v) => `${v}kg`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="yellow" stroke="#FACC15" fill="url(#colorYellowTrend)" name="Yellow" />
              <Area type="monotone" dataKey="red" stroke="#EF4444" fill="url(#colorRedTrend)" name="Red" />
              <Area type="monotone" dataKey="blue" stroke="#3B82F6" fill="url(#colorBlueTrend)" name="Blue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
