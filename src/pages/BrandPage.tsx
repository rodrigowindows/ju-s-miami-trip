import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useSettings } from "@/hooks/useSettings";
import { calculatePriceBRL } from "@/lib/calculations";
import { ProductCard } from "@/components/catalog/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ChevronRight } from "lucide-react";
import { slugify } from "@/lib/slugify";


interface BrandInfo {
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
}

export default function BrandPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { data: products = [], isLoading: productsLoading } = useCatalogProducts();
  const { data: settings } = useSettings();
  const [sortBy, setSortBy] = useState("new");
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [brandLoading, setBrandLoading] = useState(true);

  // Fetch brand info from brands table
  useEffect(() => {
    async function fetchBrand() {
      setBrandLoading(true);
      const { data } = await (supabase as any).from("brands")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      setBrandInfo(data as BrandInfo | null);
      setBrandLoading(false);
    }
    if (slug) fetchBrand();
  }, [slug]);

  const brandProducts = useMemo(() => {
    let list = products.filter((p) => slugify(p.brand || "") === slug);
    if (sortBy === "price_asc") list = [...list].sort((a, b) => a.price_usd - b.price_usd);
    if (sortBy === "price_desc") list = [...list].sort((a, b) => b.price_usd - a.price_usd);
    if (sortBy === "best") list = [...list].sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    return list;
  }, [products, slug, sortBy]);

  const brandName = brandInfo?.name ?? brandProducts[0]?.brand ?? String(slug ?? "Marca");
  const exchangeRate = Number(settings?.exchange_rate ?? "5.80");
  const spread = Number(settings?.spread_percent ?? "45");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    brandProducts.forEach((p) => { if (p.category) cats.add(p.category); });
    return [...cats];
  }, [brandProducts]);

  const prontaEntrega = brandProducts.filter((p) => p.availability_type === "pronta_entrega").length;
  const isLoading = productsLoading || brandLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-1">
          <Link to="/" className="hover:underline hover:text-gray-700">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-500">Marcas</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{brandName}</span>
        </div>
      </div>

      {/* Brand Hero */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-5">
            {brandInfo?.logo_url ? (
              <img src={brandInfo.logo_url} alt={brandName} className="w-20 h-20 rounded-xl object-contain border p-2 bg-white shadow-sm" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 flex items-center justify-center border shadow-sm">
                <span className="text-2xl font-bold text-rose-500">{brandName.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{brandName}</h1>
              {brandInfo?.description ? (
                <p className="text-gray-600 mt-1 text-sm md:text-base">{brandInfo.description}</p>
              ) : (
                <p className="text-gray-500 mt-1 text-sm">Explore os produtos {brandName} disponíveis para compra nos EUA.</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200">
                  {brandProducts.length} produto{brandProducts.length !== 1 ? "s" : ""}
                </Badge>
                {prontaEntrega > 0 && (
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200">
                    {prontaEntrega} pronta entrega
                  </Badge>
                )}
                {categories.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sort bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{brandProducts.length}</span> produto{brandProducts.length !== 1 ? "s" : ""}
          </p>
          <select
            className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-rose-200 focus:outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="new">Novidades</option>
            <option value="best">Mais vendidos</option>
            <option value="price_asc">Menor preço</option>
            <option value="price_desc">Maior preço</option>
          </select>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {brandProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Nenhum produto encontrado</h3>
            <p className="text-sm text-gray-500 mt-1">Esta marca ainda não tem produtos cadastrados.</p>
            <Link to="/" className="inline-block mt-4 text-sm text-rose-600 hover:underline">Voltar ao catálogo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brandProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                brl={calculatePriceBRL(p.price_usd, exchangeRate, spread)}
                onClick={() => nav(`/produto/${slugify(p.name)}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
