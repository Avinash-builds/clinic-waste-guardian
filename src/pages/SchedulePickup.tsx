import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePickupSchedules, useUpdatePickupSchedule } from "@/hooks/usePickupSchedules";
import { useAuth } from "@/hooks/useAuth";
import { SchedulePickupDialog } from "@/components/dashboard/SchedulePickupDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserRole } from "@/hooks/useUserRole";
import { createNotification, notifyAllAdmins } from "@/lib/notifications";
import { Truck, Plus, CheckCircle, Clock, Calendar, MessageSquare } from "lucide-react";
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
  const { isAdmin } = useUserRole();
  const [requestOpen, setRequestOpen] = useState(false);
  const [replyPickup, setReplyPickup] = useState<any>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [replyAction, setReplyAction] = useState<"accept" | "schedule">("accept");

  const handleAdminReply = () => {
    if (!replyPickup) return;

    if (replyAction === "accept") {
      updatePickup.mutate(
        { id: replyPickup.id, status: "verified", verified_by: user?.id },
        {
          onSuccess: () => {
            toast.success("Pickup request accepted! Clinic will be notified.");
            if (replyPickup.requested_by) {
              createNotification({
                userId: replyPickup.requested_by,
                title: "Pickup Request Accepted",
                message: `Your pickup request for ${Number(replyPickup.total_weight_kg).toFixed(1)} kg from ${replyPickup.clinics?.name || "your clinic"} has been accepted. We will schedule a date soon.`,
                type: "completed",
                link: "/schedule-pickup",
              });
            }
            setReplyPickup(null);
          },
          onError: (e: any) => toast.error(e.message),
        }
      );
    } else {
      if (!scheduleDate) { toast.error("Please select a date"); return; }
      updatePickup.mutate(
        {
          id: replyPickup.id,
          status: "scheduled",
          scheduled_date: new Date(scheduleDate).toISOString(),
          vehicle_number: vehicleNumber || undefined,
          driver_name: driverName || undefined,
          verified_by: user?.id,
        },
        {
          onSuccess: () => {
            toast.success("Pickup scheduled! Clinic will see the assigned date.");
            if (replyPickup.requested_by) {
              createNotification({
                userId: replyPickup.requested_by,
                title: "Pickup Scheduled",
                message: `Your pickup from ${replyPickup.clinics?.name || "your clinic"} has been scheduled for ${new Date(scheduleDate).toLocaleDateString()}.${vehicleNumber ? ` Vehicle: ${vehicleNumber}.` : ""}${driverName ? ` Driver: ${driverName}.` : ""}`,
                type: "reminder",
                link: "/schedule-pickup",
              });
            }
            setReplyPickup(null);
            setScheduleDate(""); setVehicleNumber(""); setDriverName("");
          },
          onError: (e: any) => toast.error(e.message),
        }
      );
    }
  };

  const handleComplete = (id: string) => {
    updatePickup.mutate(
      { id, status: "completed" },
      {
        onSuccess: () => toast.success("Pickup marked as completed!"),
        onError: (e: any) => toast.error(e.message),
      }
    );
  };

  const stats = {
    total: pickups?.length || 0,
    pending: pickups?.filter(p => p.status === "pending").length || 0,
    scheduled: pickups?.filter(p => p.status === "scheduled" || p.status === "verified").length || 0,
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
              <p className="text-muted-foreground">Clinics request pickups · Admins verify and schedule dates</p>
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
                  <div className={`p-3 rounded-xl bg-muted ${s.color}`}><s.icon className="w-6 h-6" /></div>
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
                      <TableHead>Vehicle / Driver</TableHead>
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
                        <TableCell className="text-sm">
                          {p.vehicle_number || p.driver_name
                            ? `${p.vehicle_number || ""} ${p.driver_name ? `/ ${p.driver_name}` : ""}`
                            : "—"}
                        </TableCell>
                        <TableCell><Badge className={statusColors[p.status] || "bg-muted"}>{p.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {isAdmin && (p.status === "pending" || p.status === "verified") && (
                              <Button size="sm" variant="outline" onClick={() => { setReplyPickup(p); setReplyAction(p.status === "pending" ? "accept" : "schedule"); }}>
                                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                                {p.status === "pending" ? "Reply" : "Schedule"}
                              </Button>
                            )}
                            {isAdmin && p.status === "scheduled" && (
                              <Button size="sm" variant="outline" onClick={() => handleComplete(p.id)}>
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <SchedulePickupDialog open={requestOpen} onOpenChange={setRequestOpen} />

          {/* Admin Reply Dialog */}
          <Dialog open={!!replyPickup} onOpenChange={() => setReplyPickup(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {replyAction === "accept" ? "Accept Pickup Request" : "Schedule Pickup Date"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <p><strong>Clinic:</strong> {replyPickup?.clinics?.name}</p>
                  <p><strong>Weight:</strong> {Number(replyPickup?.total_weight_kg || 0).toFixed(1)} kg</p>
                  <p><strong>Categories:</strong> {(replyPickup?.waste_details as any[])?.map((d: any) => d.category).join(", ")}</p>
                  {replyPickup?.notes && <p><strong>Notes:</strong> {replyPickup.notes}</p>}
                </div>

                {replyAction === "accept" ? (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Accepting this request verifies the waste details. You can schedule the pickup date afterward.
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAdminReply} className="flex-1" disabled={updatePickup.isPending}>
                        {updatePickup.isPending ? "Accepting..." : "Accept Request"}
                      </Button>
                      <Button variant="outline" onClick={() => setReplyAction("schedule")} className="flex-1">
                        Accept & Schedule Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label>Pickup Date *</Label>
                      <Input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>Vehicle Number</Label>
                      <Input value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} placeholder="e.g. TN-01-AB-1234" />
                    </div>
                    <div>
                      <Label>Driver Name</Label>
                      <Input value={driverName} onChange={e => setDriverName(e.target.value)} placeholder="Driver assigned" />
                    </div>
                    <Button onClick={handleAdminReply} className="w-full" disabled={updatePickup.isPending || !scheduleDate}>
                      {updatePickup.isPending ? "Scheduling..." : "Confirm & Notify Clinic"}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default SchedulePickup;
