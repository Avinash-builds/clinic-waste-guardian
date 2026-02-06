import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { WasteEntryForm } from "@/components/waste-entry/WasteEntryForm";
import { WasteEntryHistory } from "@/components/waste-entry/WasteEntryHistory";

const WasteEntry = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground">Waste Entry</h1>
            <p className="text-muted-foreground">Record and categorize biomedical waste</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WasteEntryForm />
            <WasteEntryHistory />
          </div>
        </main>
      </div>
    </div>
  );
};

export default WasteEntry;
