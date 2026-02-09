import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Clinic = Tables<"clinics">;

export function useClinics() {
  return useQuery({
    queryKey: ["clinics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinics")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Clinic[];
    },
  });
}

export function useActiveClinicCount() {
  return useQuery({
    queryKey: ["clinics", "active-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("clinics")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      
      if (error) throw error;
      return count || 0;
    },
  });
}
