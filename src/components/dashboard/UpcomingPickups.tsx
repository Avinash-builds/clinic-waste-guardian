import { Truck, Clock, MapPin } from "lucide-react";

interface Pickup {
  id: string;
  clinic: string;
  time: string;
  categories: string[];
  status: 'scheduled' | 'in-transit' | 'arriving';
}

const mockPickups: Pickup[] = [
  { id: 'PK-001', clinic: 'City Health Clinic', time: '10:30 AM', categories: ['Yellow', 'Red'], status: 'arriving' },
  { id: 'PK-002', clinic: 'Metro Diagnostics', time: '2:00 PM', categories: ['Blue', 'Sharps'], status: 'scheduled' },
  { id: 'PK-003', clinic: 'Care First Clinic', time: '4:30 PM', categories: ['Yellow', 'White'], status: 'scheduled' },
];

const statusStyles = {
  'scheduled': 'text-muted-foreground',
  'in-transit': 'text-waste-blue',
  'arriving': 'text-success',
};

const statusLabels = {
  'scheduled': 'Scheduled',
  'in-transit': 'In Transit',
  'arriving': 'Arriving Soon',
};

export function UpcomingPickups() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground">Upcoming Pickups</h3>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Today</span>
      </div>
      
      <div className="space-y-4">
        {mockPickups.map((pickup) => (
          <div 
            key={pickup.id} 
            className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{pickup.clinic}</p>
                  <p className="text-xs text-muted-foreground">{pickup.id}</p>
                </div>
              </div>
              <span className={`text-xs font-medium ${statusStyles[pickup.status]}`}>
                {statusLabels[pickup.status]}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{pickup.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {pickup.categories.map((cat) => (
                  <span 
                    key={cat} 
                    className={`waste-badge waste-badge-${cat.toLowerCase()}`}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
