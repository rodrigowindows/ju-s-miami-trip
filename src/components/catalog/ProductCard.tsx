import { Heart, ShoppingBag, Truck } from "lucide-react";
import { StarRating } from "./StarRating";
import { fakeRating, fakePreviousPrice } from "./catalog-utils";
import { getMLComparison } from "@/lib/ml-prices";
import { ProductImage } from "./ProductImage";
import type { CatalogProduct } from "@/types";

export interface ActiveDeal {
  discount_percent: number;
  deal_type: string;
}

interface ProductCardProps {
  product: CatalogProduct;
  brl: number;
  onClick: () => void;
  onAddToCart?: (e: React.MouseEvent) => void;
  activeDeal?: ActiveDeal | null;
  wishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
}

function AvailabilityBadge({ product }: { product: CatalogProduct }) {
  if (product.availability_type === "sob_encomenda") {
    return (
      <span className="absolute top-2 left-2 bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-1 rounded-full">
        Sob Encomenda{product.estimated_days ? ` (${product.estimated_days} dias)` : ""}
      </span>
    );
  }
  if (product.availability_type === "esgotado") {
    return <span className="absolute top-2 left-2 bg-gray-200 text-gray-700 text-[10px] font-semibold px-2 py-1 rounded-full">Esgotado</span>;
  }
  return <span className="absolute top-2 left-2 bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-1 rounded-full">Pronta Entrega</span>;
}

export function ProductCard({ product, brl, onClick, onAddToCart, activeDeal, wishlisted, onToggleWishlist }: ProductCardProps) {
  const { rating, reviews } = fakeRating(product.name);
  const prevPrice = fakePreviousPrice(brl, product.name);
  const finalPrice = activeDeal ? brl * (1 - activeDeal.discount_percent / 100) : brl;
  const installment = finalPrice / 3;
  const isSoldOut = product.availability_type === "esgotado" && product.stock_quantity != null && product.stock_quantity <= 0;
  const mlComparison = getMLComparison(finalPrice, product.brand, product.category);

  return (
    <div onClick={onClick} className="bg-white rounded-xl overflow-hidden text-left group flex flex-col cursor-pointer border border-gray-100 hover:shadow-md transition-shadow">
      <div className="aspect-square relative overflow-hidden bg-white">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          brand={product.brand}
          category={product.category}
          className="w-full h-full object-cover rounded-t-xl"
        />

        <AvailabilityBadge product={product} />

        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(e);
            }}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm hover:bg-white transition-colors"
          >
            <Heart size={16} className={wishlisted ? "fill-[#F43F5E] text-[#F43F5E]" : "text-gray-400"} />
          </button>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 bg-gray-900/45 flex items-center justify-center px-3 text-center">
            <p className="text-white text-xs font-semibold">Esgotado · Avise-me quando chegar</p>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-[11px] text-[#F43F5E] font-medium uppercase tracking-wide">{product.brand}</p>
        <p className="text-sm text-black leading-tight line-clamp-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          {product.name}
        </p>

        <StarRating rating={rating} reviews={reviews} />

        <div className="mt-auto pt-1.5">
          <p className="text-[13px] text-[#999] line-through">R$ {prevPrice.toFixed(2).replace(".", ",")}</p>
          <p className="text-lg font-bold text-black" style={{ fontFamily: "Poppins, sans-serif" }}>
            R$ {finalPrice.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-xs text-[#666]">3x de R$ {installment.toFixed(2).replace(".", ",")}</p>
          {mlComparison && (
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              {mlComparison.savingsPercent}% mais barato que ML
            </p>
          )}
        </div>

        {/* Frete badge */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {finalPrice >= 500 ? (
            <span
              className="text-[11px] font-medium px-1.5 py-0.5 rounded"
              style={{ color: "#28a745", border: "1px solid #28a745" }}
            >
              <Truck size={10} className="inline mr-0.5 -mt-0.5" />
              Frete grátis
            </span>
          ) : (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded text-gray-500 border border-gray-300">
              <Truck size={10} className="inline mr-0.5 -mt-0.5" />
              Frete a calcular
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isSoldOut && onAddToCart) {
              onAddToCart(e);
              return;
            }
            onClick();
          }}
          className="w-full mt-2 bg-[#F43F5E] text-white rounded-md font-semibold text-sm flex items-center justify-center gap-1.5 hover:opacity-90 transition-colors h-11 disabled:opacity-60"
          disabled={isSoldOut}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <ShoppingBag size={14} />
          {isSoldOut ? "AVISE-ME" : "COMPRAR"}
        </button>
      </div>
    </div>
  );
}
