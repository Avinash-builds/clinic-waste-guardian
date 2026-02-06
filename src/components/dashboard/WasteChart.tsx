import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', yellow: 24, red: 18, blue: 30, white: 12, sharps: 8 },
  { name: 'Tue', yellow: 30, red: 22, blue: 25, white: 15, sharps: 10 },
  { name: 'Wed', yellow: 28, red: 20, blue: 32, white: 18, sharps: 12 },
  { name: 'Thu', yellow: 35, red: 25, blue: 28, white: 20, sharps: 14 },
  { name: 'Fri', yellow: 32, red: 28, blue: 35, white: 16, sharps: 11 },
  { name: 'Sat', yellow: 20, red: 15, blue: 22, white: 10, sharps: 6 },
  { name: 'Sun', yellow: 18, red: 12, blue: 18, white: 8, sharps: 5 },
];

export function WasteChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
      <div className="mb-6">
        <h3 className="font-display font-semibold text-lg text-foreground">Weekly Waste Trends</h3>
        <p className="text-sm text-muted-foreground">Waste collection overview by category</p>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            />
            <Area 
              type="monotone" 
              dataKey="red" 
              stroke="#EF4444" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRed)" 
            />
            <Area 
              type="monotone" 
              dataKey="blue" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorBlue)" 
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
