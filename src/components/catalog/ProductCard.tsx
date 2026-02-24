import { Heart, Truck, Zap, Share2, ShoppingBag } from "lucide-react";
import { StarRating } from "./StarRating";
import { fakeRating, isBestSeller, fakePreviousPrice } from "./catalog-utils";
import { shareProductWhatsApp } from "@/lib/share";
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

export function ProductCard({ product, brl, onClick, onAddToCart, activeDeal, wishlisted, onToggleWishlist }: ProductCardProps) {
  const { rating, reviews } = fakeRating(product.name);
  const bestSeller = isBestSeller(product.name);
  const prevPrice = fakePreviousPrice(brl, product.name);
  const finalPrice = activeDeal ? brl * (1 - activeDeal.discount_percent / 100) : brl;
  const installment = finalPrice / 3;
  const discountPct = activeDeal
    ? activeDeal.discount_percent
    : Math.round(((prevPrice - brl) / prevPrice) * 100);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden text-left group flex flex-col cursor-pointer"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "box-shadow 0.3s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)")}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount badge */}
        {discountPct > 0 && (
          <span
            className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded"
            style={{ backgroundColor: "#a61f02" }}
          >
            -{discountPct}% OFF
          </span>
        )}

        {/* Best seller badge (when no deal discount) */}
        {!activeDeal && bestSeller && discountPct <= 0 && (
          <span className="absolute top-2 left-2 bg-[#E47911] text-white text-xs font-bold px-2 py-1 rounded">
            Mais vendido
          </span>
        )}

        {/* Wishlist + Share buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          {onToggleWishlist && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(e); }}
              className="bg-white/90 rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
            >
              <Heart
                size={16}
                className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              shareProductWhatsApp(product, finalPrice);
            }}
            className="bg-white/90 rounded-full p-1.5 shadow-md hover:bg-white transition-colors"
            aria-label="Compartilhar"
          >
            <Share2 size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-sm text-black font-normal leading-tight line-clamp-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          {product.name}
        </p>

        <StarRating rating={rating} reviews={reviews} />

        {/* Prices */}
        <div className="mt-auto pt-1.5">
          <p className="text-[13px] text-[#999] line-through">
            R$ {prevPrice.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-lg font-bold text-black" style={{ fontFamily: "Poppins, sans-serif" }}>
            R$ {finalPrice.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-xs text-[#666]">
            3x de R$ {installment.toFixed(2).replace(".", ",")} sem juros
          </p>
        </div>

        {/* Frete gratis badge */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span
            className="text-[11px] font-medium px-1.5 py-0.5 rounded"
            style={{ color: "#28a745", border: "1px solid #28a745" }}
          >
            <Truck size={10} className="inline mr-0.5 -mt-0.5" />
            Frete gratis
          </span>
        </div>

        {/* Buy button */}
        {onAddToCart ? (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(e); }}
            className="w-full mt-2 bg-black text-white rounded font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-[#333] transition-colors"
            style={{ height: 40, fontFamily: "Poppins, sans-serif" }}
          >
            <ShoppingBag size={14} />
            COMPRAR
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="w-full mt-2 bg-black text-white rounded font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-[#333] transition-colors"
            style={{ height: 40, fontFamily: "Poppins, sans-serif" }}
          >
            <ShoppingBag size={14} />
            COMPRAR
          </button>
        )}
      </div>
    </div>
  );
}
