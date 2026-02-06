import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Jan", yellow: 1200, red: 800, blue: 600, white: 400, sharps: 200 },
  { month: "Feb", yellow: 1350, red: 900, blue: 650, white: 450, sharps: 220 },
  { month: "Mar", yellow: 1100, red: 750, blue: 580, white: 380, sharps: 180 },
  { month: "Apr", yellow: 1450, red: 950, blue: 700, white: 500, sharps: 250 },
  { month: "May", yellow: 1300, red: 850, blue: 620, white: 420, sharps: 210 },
  { month: "Jun", yellow: 1500, red: 1000, blue: 750, white: 520, sharps: 280 },
];

export function WasteTrendsChart() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Monthly Waste Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="yellow" stroke="#FACC15" fill="url(#colorYellow)" />
              <Area type="monotone" dataKey="red" stroke="#EF4444" fill="url(#colorRed)" />
              <Area type="monotone" dataKey="blue" stroke="#3B82F6" fill="url(#colorBlue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
