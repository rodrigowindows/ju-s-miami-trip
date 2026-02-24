import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useSettings } from "@/hooks/useSettings";
import { calculatePriceBRL } from "@/lib/calculations";
import { ProductCard } from "@/components/catalog/ProductCard";

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BrandPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { data: products = [] } = useCatalogProducts();
  const { data: settings } = useSettings();
  const [sortBy, setSortBy] = useState("new");

  const brandProducts = useMemo(() => {
    let list = products.filter((p) => slugify(p.brand || "") === slug);
    if (sortBy === "price_asc") list = [...list].sort((a, b) => a.price_usd - b.price_usd);
    if (sortBy === "price_desc") list = [...list].sort((a, b) => b.price_usd - a.price_usd);
    if (sortBy === "best") list = [...list].sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
    return list;
  }, [products, slug, sortBy]);

  const brandName = brandProducts[0]?.brand ?? String(slug ?? "Marca");
  const exchangeRate = Number(settings?.exchange_rate ?? "5.70");
  const spread = Number(settings?.spread_percent ?? "3");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500">
        <Link to="/" className="hover:underline">Home</Link> &gt; <span className="text-gray-800">Marcas</span> &gt; <span className="text-gray-800">{brandName}</span>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-5">
        <h1 className="text-3xl font-semibold">{brandName}</h1>
        <p className="text-gray-600 mt-2">Explore os produtos disponíveis desta marca.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between pb-4">
        <p className="text-sm text-gray-600">{brandProducts.length} produto(s)</p>
        <select className="border rounded-md px-2 py-1 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="new">Novidades</option>
          <option value="best">Mais vendidos</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
        </select>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {brandProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            brl={calculatePriceBRL(p.price_usd, exchangeRate, spread)}
            onClick={() => nav(`/produto/${slugify(p.name)}`)}
          />
        ))}
      </div>
    </div>
  );
}
