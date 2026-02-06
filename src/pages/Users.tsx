import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { UsersTable } from "@/components/users/UsersTable";
import { UserStats } from "@/components/users/UserStats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Users = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage system users and permissions</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
          
          <UserStats />
          
          <div className="mt-6">
            <UsersTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Users;
