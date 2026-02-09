import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWasteRecords } from '@/hooks/useWasteRecords';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';

export function WasteChart() {
  const { data: records, isLoading } = useWasteRecords();

  const chartData = useMemo(() => {
    // Generate last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      days.push({
        name: format(date, 'EEE'),
        date: startOfDay(date),
        yellow: 0,
        red: 0,
        blue: 0,
        white: 0,
        sharps: 0,
      });
    }

    if (!records || records.length === 0) {
      return days;
    }

    // Aggregate records by day
    records.forEach((record) => {
      const recordDate = startOfDay(new Date(record.recorded_at));
      const dayData = days.find(d => isSameDay(d.date, recordDate));
      
      if (dayData) {
        const colorCode = record.waste_categories?.color_code?.toLowerCase() || "";
        const weight = Number(record.weight_kg);
        
        if (colorCode.includes("yellow") || colorCode === "#f59e0b") {
          dayData.yellow += weight;
        } else if (colorCode.includes("red") || colorCode === "#ef4444") {
          dayData.red += weight;
        } else if (colorCode.includes("blue") || colorCode === "#3b82f6") {
          dayData.blue += weight;
        } else if (colorCode.includes("white") || colorCode === "#f3f4f6") {
          dayData.white += weight;
        } else {
          dayData.sharps += weight;
        }
      }
    });

    return days.map(d => ({
      name: d.name,
      yellow: Math.round(d.yellow * 10) / 10,
      red: Math.round(d.red * 10) / 10,
      blue: Math.round(d.blue * 10) / 10,
      white: Math.round(d.white * 10) / 10,
      sharps: Math.round(d.sharps * 10) / 10,
    }));
  }, [records]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
        <div className="mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="font-display font-semibold text-lg text-foreground">Weekly Waste Trends</h3>
        <p className="text-sm text-muted-foreground">Waste collection overview by category</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${value}kg`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="yellow" 
              stroke="#FACC15" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorYellow)" 
              name="Yellow"
            />
            <Area 
              type="monotone" 
              dataKey="red" 
              stroke="#EF4444" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRed)" 
              name="Red"
            />
            <Area 
              type="monotone" 
              dataKey="blue" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorBlue)" 
              name="Blue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-waste-yellow" />
          <span className="text-sm text-muted-foreground">Yellow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-waste-red" />
          <span className="text-sm text-muted-foreground">Red</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-waste-blue" />
          <span className="text-sm text-muted-foreground">Blue</span>
        </div>
      </div>
    </div>
  );
}
