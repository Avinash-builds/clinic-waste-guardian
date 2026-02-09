import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;

export type UserRole = Tables<"user_roles">;

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");
      
      if (rolesError) throw rolesError;

      // Map roles to profiles
      return profiles.map(profile => ({
        ...profile,
        role: roles?.find(r => r.user_id === profile.user_id)?.role || "clinic_staff",
      }));
    },
  });
}

export function useProfileStats() {
  return useQuery({
    queryKey: ["profiles", "stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role");

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        admins: data?.filter(r => r.role === "admin").length || 0,
        moderators: data?.filter(r => r.role === "moderator").length || 0,
        staff: data?.filter(r => r.role === "clinic_staff").length || 0,
      };

      return stats;
    },
  });
}
