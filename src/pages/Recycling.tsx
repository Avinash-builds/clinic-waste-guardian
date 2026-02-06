import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { RecyclingStats } from "@/components/recycling/RecyclingStats";
import { RecyclingBatches } from "@/components/recycling/RecyclingBatches";
import { RecyclingProcess } from "@/components/recycling/RecyclingProcess";

const Recycling = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground">Recycling Management</h1>
            <p className="text-muted-foreground">Track recyclable waste batches and processing</p>
          </div>
          
          <RecyclingStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RecyclingBatches />
            <RecyclingProcess />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Recycling;
