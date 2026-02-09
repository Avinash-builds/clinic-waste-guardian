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
import { useProfiles } from "@/hooks/useProfiles";
import { Skeleton } from "@/components/ui/skeleton";

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800",
    moderator: "bg-blue-100 text-blue-800",
    clinic_staff: "bg-muted text-muted-foreground",
  };
  return colors[role] || "bg-muted";
};

export function UsersTable() {
  const { data: profiles, isLoading, error } = useProfiles();

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">System Users</CardTitle>
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
          <CardTitle className="font-display">System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-center">Failed to load users</p>
        </CardContent>
      </Card>
    );
  }

  const isEmpty = !profiles || profiles.length === 0;

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="font-display">System Users</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users registered yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium font-mono text-xs">
                    {profile.id.slice(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {profile.full_name || "Unnamed User"}
                  </TableCell>
                  <TableCell>{profile.email || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(profile.role)}>
                      {profile.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{profile.phone || "N/A"}</TableCell>
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
        )}
      </CardContent>
    </Card>
  );
}
