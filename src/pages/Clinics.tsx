import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ClinicsTable } from "@/components/clinics/ClinicsTable";
import { ClinicStats } from "@/components/clinics/ClinicStats";
import { AddClinicDialog } from "@/components/clinics/AddClinicDialog";

const Clinics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Clinics Management</h1>
              <p className="text-muted-foreground">Register and manage clinic profiles</p>
            </div>
            <AddClinicDialog />
          </div>
          <ClinicStats />
          <div className="mt-6">
            <ClinicsTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Clinics;
