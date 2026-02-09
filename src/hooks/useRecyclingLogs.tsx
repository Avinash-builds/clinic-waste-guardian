import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type RecyclingLog = Tables<"recycling_logs"> & {
  waste_categories?: { name: string; color_code: string } | null;
};

export function useRecyclingLogs() {
  return useQuery({
    queryKey: ["recycling-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recycling_logs")
        .select(`
          *,
          waste_categories (name, color_code)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as RecyclingLog[];
    },
  });
}

export function useRecyclingStats() {
  return useQuery({
    queryKey: ["recycling-logs", "stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recycling_logs")
        .select("input_weight_kg, output_weight_kg, status");

      if (error) throw error;

      const stats = {
        totalInput: 0,
        totalOutput: 0,
        processingCount: 0,
        completedCount: 0,
        avgRecyclingRate: 0,
      };

      data?.forEach((log) => {
        stats.totalInput += Number(log.input_weight_kg) || 0;
        stats.totalOutput += Number(log.output_weight_kg) || 0;
        if (log.status === "processing") stats.processingCount++;
        if (log.status === "completed") stats.completedCount++;
      });

      if (stats.totalInput > 0) {
        stats.avgRecyclingRate = Math.round((stats.totalOutput / stats.totalInput) * 100);
      }

      return stats;
    },
  });
}
