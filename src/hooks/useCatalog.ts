import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fixImageUrl } from "@/lib/fix-image-urls";
import type { CatalogProduct } from "@/types";

export function useCatalogProducts(category?: string) {
  return useQuery<CatalogProduct[]>({
    queryKey: ["catalog_products", category],
    queryFn: async () => {
      let query = supabase.from("catalog_products").select("*").eq("active", true).order("created_at", { ascending: false });
      if (category && category !== "Todos") query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return ((data ?? []) as CatalogProduct[]).filter((p) => p.image_url && p.image_url.trim() !== "").map((p) => ({
        ...p,
        image_url: fixImageUrl(p.image_url),
        availability_type: (!p.availability_type || p.availability_type === "esgotado") ? "pronta_entrega" : p.availability_type,
        stock_quantity: (!p.stock_quantity || p.stock_quantity <= 0) ? 2 : p.stock_quantity,
      }));
    },
  });
}
