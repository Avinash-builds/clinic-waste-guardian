import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useWasteByCategoryStats } from "@/hooks/useWasteRecords";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#FACC15", "#EF4444", "#3B82F6", "#E5E7EB", "#6B7280"];

export function CategoryBreakdown() {
  const { data: categoryStats, isLoading, error } = useWasteByCategoryStats();

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const isEmpty = !categoryStats || categoryStats.length === 0;

  const chartData = isEmpty 
    ? [
        { name: "Yellow", value: 20, color: "#FACC15" },
        { name: "Red", value: 20, color: "#EF4444" },
        { name: "Blue", value: 20, color: "#3B82F6" },
        { name: "White", value: 20, color: "#E5E7EB" },
        { name: "Others", value: 20, color: "#6B7280" },
      ]
    : categoryStats.map((cat, index) => ({
        name: cat.name.split(" - ")[0] || cat.name,
        value: cat.percentage,
        color: COLORS[index % COLORS.length],
      }));

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value}%`, "Share"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {isEmpty && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            No waste data yet. Add entries to see breakdown.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
