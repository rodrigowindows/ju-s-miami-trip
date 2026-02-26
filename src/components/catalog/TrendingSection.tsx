import { TrendingUp } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { CatalogProduct } from "@/types";

interface TrendingSectionProps {
  products: CatalogProduct[];
  convert: (usd: number) => number;
  onSelectProduct: (p: CatalogProduct) => void;
}

export default function TrendingSection({ products, convert, onSelectProduct }: TrendingSectionProps) {
  const trending = products.filter((p) => p.trending).slice(0, 8);

  // Fallback: if no trending flag, pick products with highest sales_count
  const final = trending.length >= 4
    ? trending
    : [...products].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0)).slice(0, 8);

  if (final.length === 0) return null;

  return (
    <section className="rounded-xl px-4 py-6 sm:px-10 sm:py-10 bg-gradient-to-br from-violet-50 to-purple-50 border border-purple-100">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={24} className="text-purple-600" />
        <h2
          className="text-xl sm:text-2xl font-bold text-black"
          style={{ fontFamily: "'Playfair Display', 'Gabarito', serif" }}
        >
          ESCOLHIDOS PARA VOCÊ
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {final.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            brl={convert(product.price_usd)}
            onClick={() => onSelectProduct(product)}
          />
        ))}
      </div>
    </section>
  );
}
