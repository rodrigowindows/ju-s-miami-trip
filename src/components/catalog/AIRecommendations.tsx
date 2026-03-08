import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useSettings } from "@/hooks/useSettings";

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price_usd: number;
  image_url: string;
  rating: number;
  review_count: number;
  availability_type: string;
  stock_quantity: number;
  trending: boolean;
};

export default function AIRecommendations({
  currentProductId,
  category,
}: {
  currentProductId?: string;
  category?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { recentIds } = useRecentlyViewed();
  const { data: settings } = useSettings();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("ai-recommend", {
          body: {
            viewed_ids: recentIds,
            current_product_id: currentProductId,
            category,
          },
        });

        if (error || !data?.product_ids?.length) {
          // Fallback: fetch trending
          const { data: fallback } = await supabase
            .from("catalog_products")
            .select("*")
            .eq("active", true)
            .neq("id", currentProductId ?? "")
            .order("sales_count", { ascending: false })
            .limit(6);
          setProducts((fallback ?? []) as Product[]);
          return;
        }

        const { data: recommended } = await supabase
          .from("catalog_products")
          .select("*")
          .in("id", data.product_ids)
          .eq("active", true);

        setProducts((recommended ?? []) as Product[]);
      } catch {
        // Silent fallback
        const { data: fallback } = await supabase
          .from("catalog_products")
          .select("*")
          .eq("active", true)
          .neq("id", currentProductId ?? "")
          .order("sales_count", { ascending: false })
          .limit(6);
        setProducts((fallback ?? []) as Product[]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId, category]);

  if (isLoading || products.length === 0) return null;

  const exchangeRate = Number(settings?.exchange_rate) || 5.8;
  const spreadPct = Number(settings?.spread_pct) || 5;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-primary" />
        <h3 className="font-semibold text-sm">Recomendados para você</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            exchangeRate={exchangeRate}
            spreadPct={spreadPct}
          />
        ))}
      </div>
    </div>
  );
}
