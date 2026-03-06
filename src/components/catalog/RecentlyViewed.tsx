import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock } from "lucide-react";
import { ProductImage } from "./ProductImage";
import type { CatalogProduct } from "@/types";

interface RecentlyViewedProps {
  productIds: string[];
  calcBRL: (usd: number) => number;
  onSelect: (product: CatalogProduct) => void;
}

export function RecentlyViewed({ productIds, calcBRL, onSelect }: RecentlyViewedProps) {
  const { data: products } = useQuery<CatalogProduct[]>({
    queryKey: ["recently_viewed_products", productIds],
    enabled: productIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalog_products")
        .select("*")
        .in("id", productIds)
        .eq("active", true);
      if (error) throw error;
      // preserve order from productIds
      const map = new Map((data ?? []).map((p) => [p.id, p as CatalogProduct]));
      return productIds.map((id) => map.get(id)).filter(Boolean) as CatalogProduct[];
    },
  });

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 py-3">
      <div className="px-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Clock size={14} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Vistos recentemente</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          {products.map((p) => {
            const brl = calcBRL(p.price_usd);
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="shrink-0 w-[120px] text-left group"
              >
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-1.5 flex items-center justify-center p-2">
                  <ProductImage
                    src={p.image_url}
                    alt={p.name}
                    brand={p.brand}
                    category={p.category}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-[11px] text-gray-900 leading-tight line-clamp-2">{p.name}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  R$ {Math.floor(brl).toLocaleString("pt-BR")}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
