import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type WasteRecord = Tables<"waste_records"> & {
  clinics?: { name: string } | null;
  waste_categories?: { name: string; color_code: string } | null;
};

export function useWasteRecords(limit?: number) {
  return useQuery({
    queryKey: ["waste-records", limit],
    queryFn: async () => {
      let query = supabase
        .from("waste_records")
        .select(`
          *,
          clinics (name),
          waste_categories (name, color_code)
        `)
        .order("recorded_at", { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as WasteRecord[];
    },
  });
}

export function useWasteRecordStats() {
  return useQuery({
    queryKey: ["waste-records", "stats"],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      // Get current month total
      const { data: currentMonthData, error: currentError } = await supabase
        .from("waste_records")
        .select("weight_kg")
        .gte("recorded_at", startOfMonth);

      if (currentError) throw currentError;

      // Get last month total
      const { data: lastMonthData, error: lastError } = await supabase
        .from("waste_records")
        .select("weight_kg")
        .gte("recorded_at", startOfLastMonth)
        .lte("recorded_at", endOfLastMonth);

      if (lastError) throw lastError;

      // Get pending pickups count
      const { count: pendingCount, error: pendingError } = await supabase
        .from("waste_records")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (pendingError) throw pendingError;

      const currentTotal = currentMonthData?.reduce((sum, r) => sum + Number(r.weight_kg), 0) || 0;
      const lastTotal = lastMonthData?.reduce((sum, r) => sum + Number(r.weight_kg), 0) || 0;
      const percentChange = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal * 100).toFixed(1) : 0;

      return {
        totalThisMonth: currentTotal,
        lastMonthTotal: lastTotal,
        percentChange: Number(percentChange),
        pendingPickups: pendingCount || 0,
      };
    },
  });
}

export function useWasteByCategoryStats() {
  return useQuery({
    queryKey: ["waste-records", "by-category"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waste_records")
        .select(`
          weight_kg,
          waste_categories (name, color_code)
        `);

      if (error) throw error;

      // Group by category
      const categoryTotals: Record<string, { name: string; color: string; total: number }> = {};
      let grandTotal = 0;

      data?.forEach((record) => {
        const catName = record.waste_categories?.name || "Unknown";
        const color = record.waste_categories?.color_code || "gray";
        const weight = Number(record.weight_kg);
        
        grandTotal += weight;
        
        if (!categoryTotals[catName]) {
          categoryTotals[catName] = { name: catName, color, total: 0 };
        }
        categoryTotals[catName].total += weight;
      });

      return Object.values(categoryTotals).map(cat => ({
        ...cat,
        percentage: grandTotal > 0 ? Math.round((cat.total / grandTotal) * 100) : 0,
      }));
    },
  });
}

export function useCreateWasteRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: TablesInsert<"waste_records">) => {
      const { data, error } = await supabase
        .from("waste_records")
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waste-records"] });
    },
  });
}
