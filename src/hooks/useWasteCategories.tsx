import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type WasteCategory = Tables<"waste_categories">;

export function useWasteCategories() {
  return useQuery({
    queryKey: ["waste-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waste_categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as WasteCategory[];
    },
  });
}
