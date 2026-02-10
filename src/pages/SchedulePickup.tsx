import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePickupSchedules, useUpdatePickupSchedule } from "@/hooks/usePickupSchedules";
import { useAuth } from "@/hooks/useAuth";
import { SchedulePickupDialog } from "@/components/dashboard/SchedulePickupDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, Plus, CheckCircle, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  verified: "bg-blue-100 text-blue-800",
  scheduled: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const SchedulePickup = () => {
  const { data: pickups, isLoading } = usePickupSchedules();
  const updatePickup = useUpdatePickupSchedule();
  const { user } = useAuth();
  const [requestOpen, setRequestOpen] = useState(false);
  const [verifyId, setVerifyId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");

  const handleVerifyAndSchedule = () => {
    if (!verifyId || !scheduleDate) return;
    updatePickup.mutate(
      {
        id: verifyId,
        status: "scheduled",
        scheduled_date: new Date(scheduleDate).toISOString(),
        vehicle_number: vehicleNumber || undefined,
        driver_name: driverName || undefined,
        verified_by: user?.id,
      },
      {
        onSuccess: () => {
          toast.success("Pickup verified and scheduled!");
          setVerifyId(null);
          setScheduleDate(""); setVehicleNumber(""); setDriverName("");
        },
        onError: (e: any) => toast.error(e.message),
      }
    );
  };

  const stats = {
    total: pickups?.length || 0,
    pending: pickups?.filter(p => p.status === "pending").length || 0,
    scheduled: pickups?.filter(p => p.status === "scheduled").length || 0,
    completed: pickups?.filter(p => p.status === "completed").length || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Schedule Pickup</h1>
              <p className="text-muted-foreground">Request and manage waste collection schedules</p>
            </div>
            <Button onClick={() => setRequestOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Request Pickup
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Requests", value: stats.total, icon: Truck, color: "text-primary" },
              { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
              { label: "Scheduled", value: stats.scheduled, icon: Calendar, color: "text-blue-500" },
              { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-green-500" },
            ].map(s => (
              <Card key={s.label} className="animate-slide-up">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-muted ${s.color}`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table */}
          <Card>
            <CardHeader><CardTitle className="font-display">Pickup Requests</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : !pickups || pickups.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pickup requests yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clinic</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pickups.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.clinics?.name || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(p.waste_details as any[])?.map((d: any, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">{d.category}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{Number(p.total_weight_kg).toFixed(1)} kg</TableCell>
                        <TableCell className="text-sm">{new Date(p.requested_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm">{p.scheduled_date ? new Date(p.scheduled_date).toLocaleDateString() : "—"}</TableCell>
                        <TableCell><Badge className={statusColors[p.status] || "bg-muted"}>{p.status}</Badge></TableCell>
                        <TableCell>
                          {p.status === "pending" && (
                            <Button size="sm" variant="outline" onClick={() => setVerifyId(p.id)}>
                              Verify & Schedule
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <SchedulePickupDialog open={requestOpen} onOpenChange={setRequestOpen} />

          {/* Verify & Schedule Dialog */}
          <Dialog open={!!verifyId} onOpenChange={() => setVerifyId(null)}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="font-display">Verify & Schedule Pickup</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Pickup Date *</Label>
                  <Input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                </div>
                <div>
                  <Label>Vehicle Number</Label>
                  <Input value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} />
                </div>
                <div>
                  <Label>Driver Name</Label>
                  <Input value={driverName} onChange={e => setDriverName(e.target.value)} />
                </div>
                <Button onClick={handleVerifyAndSchedule} className="w-full" disabled={updatePickup.isPending || !scheduleDate}>
                  {updatePickup.isPending ? "Scheduling..." : "Confirm Schedule"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default SchedulePickup;
