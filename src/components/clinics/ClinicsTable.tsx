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
import { useClinics } from "@/hooks/useClinics";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusColor = (status: string | null) => {
  const colors: Record<string, string> = {
    compliant: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    "non-compliant": "bg-red-100 text-red-800",
  };
  return colors[status || "pending"] || "bg-muted";
};

export function ClinicsTable() {
  const { data: clinics, isLoading, error } = useClinics();

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Registered Clinics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Registered Clinics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center">Failed to load clinics</p>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = !clinics || clinics.length === 0;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">Registered Clinics</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No clinics registered yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinics?.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell className="font-medium font-mono text-xs">
                    {clinic.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="font-medium">{clinic.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {clinic.address}, {clinic.city}
                  </TableCell>
                  <TableCell>{clinic.contact_person || "N/A"}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {clinic.license_number || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(clinic.compliance_status)}>
                      {clinic.compliance_status || "pending"}
                    </Badge>
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
        )}
      </CardContent>
    </Card>
  );
}
