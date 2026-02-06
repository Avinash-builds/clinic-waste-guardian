import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Edit, Trash2, Key } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  { id: "USR-001", name: "John Doe", email: "john@clinic.com", role: "Admin", clinic: "City Health Clinic", status: "active" },
  { id: "USR-002", name: "Jane Smith", email: "jane@metro.com", role: "Staff", clinic: "Metro General Hospital", status: "active" },
  { id: "USR-003", name: "Bob Wilson", email: "bob@sunrise.com", role: "Manager", clinic: "Sunrise Diagnostics", status: "active" },
  { id: "USR-004", name: "Alice Brown", email: "alice@central.com", role: "Staff", clinic: "Central Medical Center", status: "inactive" },
  { id: "USR-005", name: "Charlie Davis", email: "charlie@wellness.com", role: "Staff", clinic: "Wellness Family Clinic", status: "active" },
];

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    Admin: "bg-purple-100 text-purple-800",
    Manager: "bg-blue-100 text-blue-800",
    Staff: "bg-muted text-muted-foreground",
  };
  return colors[role] || "bg-muted";
};

const getStatusColor = (status: string) => {
  return status === "active" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground";
};

export function UsersTable() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">System Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Clinic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>{user.clinic}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
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
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key className="w-4 h-4 mr-2" />
                        Reset Password
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
