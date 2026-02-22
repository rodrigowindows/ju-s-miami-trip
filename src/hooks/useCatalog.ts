import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CatalogProduct } from "@/types";

export function useCatalogProducts(category?: string) {
  return useQuery<CatalogProduct[]>({
    queryKey: ["catalog_products", category],
    queryFn: async () => {
      let query = supabase.from("catalog_products").select("*").eq("active", true).order("created_at", { ascending: false });
      if (category && category !== "Todos") query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as CatalogProduct[];
    },
  });
}
