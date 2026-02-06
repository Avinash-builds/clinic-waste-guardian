import { cn } from "@/lib/utils";
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WasteRecord {
  id: string;
  clinic: string;
  category: 'yellow' | 'red' | 'blue' | 'white' | 'sharps';
  weight: string;
  date: string;
  status: 'pending' | 'collected' | 'processed';
}

const categoryLabels: Record<string, string> = {
  yellow: 'Yellow',
  red: 'Red',
  blue: 'Blue',
  white: 'White',
  sharps: 'Sharps',
};

const statusStyles = {
  pending: 'bg-warning-bg text-warning',
  collected: 'bg-blue-100 text-blue-700',
  processed: 'bg-success-bg text-success',
};

const mockRecords: WasteRecord[] = [
  { id: 'WR-001', clinic: 'City Health Clinic', category: 'yellow', weight: '12.5 kg', date: '2024-01-15', status: 'collected' },
  { id: 'WR-002', clinic: 'Metro Diagnostics', category: 'red', weight: '8.2 kg', date: '2024-01-15', status: 'pending' },
  { id: 'WR-003', clinic: 'Sunrise Hospital', category: 'blue', weight: '15.0 kg', date: '2024-01-14', status: 'processed' },
  { id: 'WR-004', clinic: 'Care First Clinic', category: 'sharps', weight: '3.8 kg', date: '2024-01-14', status: 'collected' },
  { id: 'WR-005', clinic: 'Health Plus Center', category: 'white', weight: '6.1 kg', date: '2024-01-13', status: 'processed' },
];

export function RecentRecords() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-slide-up">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">Recent Waste Records</h3>
          <p className="text-sm text-muted-foreground">Latest disposal entries from all clinics</p>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="rounded-tl-lg">Record ID</th>
              <th>Clinic</th>
              <th>Category</th>
              <th>Weight</th>
              <th>Date</th>
              <th>Status</th>
              <th className="rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRecords.map((record) => (
              <tr key={record.id} className="transition-colors">
                <td className="font-mono text-sm font-medium">{record.id}</td>
                <td className="font-medium">{record.clinic}</td>
                <td>
                  <span className={cn("waste-badge", `waste-badge-${record.category}`)}>
                    {categoryLabels[record.category]}
                  </span>
                </td>
                <td>{record.weight}</td>
                <td className="text-muted-foreground">{record.date}</td>
                <td>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                    statusStyles[record.status]
                  )}>
                    {record.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
