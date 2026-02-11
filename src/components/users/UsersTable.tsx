import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Key } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfiles } from "@/hooks/useProfiles";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-800",
    moderator: "bg-blue-100 text-blue-800",
    clinic_staff: "bg-muted text-muted-foreground",
  };
  return colors[role] || "bg-muted";
};

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: "Admin (Waste Mgmt)",
    moderator: "Moderator",
    clinic_staff: "Clinic Staff",
  };
  return labels[role] || role;
};

export function UsersTable() {
  const { data: profiles, isLoading, error } = useProfiles();
  const queryClient = useQueryClient();
  const [editUser, setEditUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");

  const updateRole = useMutation({
    mutationFn: async () => {
      if (!editUser) return;
      // Update user_roles table
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole as any })
        .eq("user_id", editUser.user_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      toast.success("User role updated!");
      setEditUser(null);
    },
    onError: (e: any) => toast.error(e.message || "Failed to update role"),
  });

  if (isLoading) {
    return (
      <Card className="animate-slide-up">
        <CardHeader><CardTitle className="font-display">System Users</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="animate-slide-up">
        <CardHeader><CardTitle className="font-display">System Users</CardTitle></CardHeader>
        <CardContent><p className="text-destructive text-center">Failed to load users</p></CardContent>
      </Card>
    );
  }

  const isEmpty = !profiles || profiles.length === 0;

  return (
    <>
      <Card className="animate-slide-up">
        <CardHeader><CardTitle className="font-display">System Users</CardTitle></CardHeader>
        <CardContent>
          {isEmpty ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users registered yet. Users are added when they sign up.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell className="font-medium">{profile.full_name || "Unnamed User"}</TableCell>
                    <TableCell>{profile.email || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(profile.role)}>{getRoleLabel(profile.role)}</Badge>
                    </TableCell>
                    <TableCell>{profile.phone || "N/A"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditUser(profile); setNewRole(profile.role); }}>
                            <Edit className="w-4 h-4 mr-2" /> Change Role
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

      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Change User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Changing role for <span className="font-medium text-foreground">{editUser?.full_name || editUser?.email}</span>
            </p>
            <div>
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="clinic_staff">Clinic Staff (User)</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin (Waste Management)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Clinic Staff</strong>: Clinic users who log waste entries.<br />
                <strong>Admin</strong>: Biowaste management company staff who verify pickups and manage operations.
              </p>
            </div>
            <Button onClick={() => updateRole.mutate()} className="w-full" disabled={updateRole.isPending}>
              {updateRole.isPending ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
