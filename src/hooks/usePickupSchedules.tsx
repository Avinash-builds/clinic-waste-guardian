import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PickupSchedule {
  id: string;
  clinic_id: string;
  requested_by: string | null;
  waste_details: any;
  total_weight_kg: number;
  requested_date: string;
  scheduled_date: string | null;
  status: string;
  notes: string | null;
  verified_by: string | null;
  vehicle_number: string | null;
  driver_name: string | null;
  created_at: string;
  updated_at: string;
  clinics?: { name: string } | null;
}

export function usePickupSchedules() {
  return useQuery({
    queryKey: ["pickup-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pickup_schedules")
        .select(`*, clinics (name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PickupSchedule[];
    },
  });
}

export function useCreatePickupSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (schedule: {
      clinic_id: string;
      requested_by: string;
      waste_details: any;
      total_weight_kg: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("pickup_schedules")
        .insert(schedule)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickup-schedules"] });
    },
  });
}

export function useUpdatePickupSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; scheduled_date?: string; status?: string; vehicle_number?: string; driver_name?: string; verified_by?: string }) => {
      const { data, error } = await supabase
        .from("pickup_schedules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickup-schedules"] });
    },
  });
}
