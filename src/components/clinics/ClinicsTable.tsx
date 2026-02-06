import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const clinics = [
  { id: "CLN-001", name: "City Health Clinic", address: "123 Main St", contact: "Dr. Smith", status: "compliant", wasteGenerated: "245 kg" },
  { id: "CLN-002", name: "Metro General Hospital", address: "456 Oak Ave", contact: "Dr. Johnson", status: "compliant", wasteGenerated: "1,250 kg" },
  { id: "CLN-003", name: "Sunrise Diagnostics", address: "789 Pine Rd", contact: "Dr. Williams", status: "pending", wasteGenerated: "178 kg" },
  { id: "CLN-004", name: "Central Medical Center", address: "321 Elm St", contact: "Dr. Brown", status: "non-compliant", wasteGenerated: "890 kg" },
  { id: "CLN-005", name: "Wellness Family Clinic", address: "654 Cedar Ln", contact: "Dr. Davis", status: "compliant", wasteGenerated: "156 kg" },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    compliant: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    "non-compliant": "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-muted";
};

export function ClinicsTable() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Registered Clinics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Waste Generated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clinics.map((clinic) => (
              <TableRow key={clinic.id}>
                <TableCell className="font-medium">{clinic.id}</TableCell>
                <TableCell className="font-medium">{clinic.name}</TableCell>
                <TableCell>{clinic.address}</TableCell>
                <TableCell>{clinic.contact}</TableCell>
                <TableCell>{clinic.wasteGenerated}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(clinic.status)}>{clinic.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
