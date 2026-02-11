import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { UsersTable } from "@/components/users/UsersTable";
import { UserStats } from "@/components/users/UserStats";

const Users = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">
              Manage system users and permissions. Users are automatically added upon signup. Admins represent biowaste management companies, clinic staff represent clinics.
            </p>
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
