import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const recentEntries = [
  { id: "WE-001", clinic: "City Health Clinic", category: "Yellow", weight: "12.5 kg", date: "2024-01-15", status: "pending" },
  { id: "WE-002", clinic: "Metro General Hospital", category: "Red", weight: "8.2 kg", date: "2024-01-15", status: "collected" },
  { id: "WE-003", clinic: "Sunrise Diagnostics", category: "Blue", weight: "3.7 kg", date: "2024-01-14", status: "processed" },
  { id: "WE-004", clinic: "City Health Clinic", category: "Sharps", weight: "1.2 kg", date: "2024-01-14", status: "pending" },
  { id: "WE-005", clinic: "Metro General Hospital", category: "White", weight: "5.8 kg", date: "2024-01-13", status: "collected" },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Yellow: "bg-waste-yellow text-waste-yellow-foreground",
    Red: "bg-waste-red text-white",
    Blue: "bg-waste-blue text-white",
    White: "bg-waste-white text-foreground border",
    Sharps: "bg-waste-sharps text-white",
  };
  return colors[category] || "bg-muted";
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    collected: "bg-blue-100 text-blue-800",
    processed: "bg-green-100 text-green-800",
  };
  return colors[status] || "bg-muted";
};

export function WasteEntryHistory() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Recent Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Clinic</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.id}</TableCell>
                <TableCell>{entry.clinic}</TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(entry.category)}>{entry.category}</Badge>
                </TableCell>
                <TableCell>{entry.weight}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(entry.status)}>
                    {entry.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
