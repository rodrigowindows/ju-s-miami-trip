import { Heart, Truck, Zap } from "lucide-react";
import { StarRating } from "./StarRating";
import { fakeRating, isBestSeller, fakePreviousPrice } from "./catalog-utils";
import type { CatalogProduct } from "@/types";

export interface ActiveDeal {
  discount_percent: number;
  deal_type: string;
}

interface ProductCardProps {
  product: CatalogProduct;
  brl: number;
  onClick: () => void;
  activeDeal?: ActiveDeal | null;
  wishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
}

export function ProductCard({ product, brl, onClick, activeDeal, wishlisted, onToggleWishlist }: ProductCardProps) {
  const { rating, reviews } = fakeRating(product.name);
  const bestSeller = isBestSeller(product.name);
  const prevPrice = fakePreviousPrice(brl, product.name);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden text-left hover:shadow-lg transition-shadow group flex flex-col border border-gray-200"
    >
      {activeDeal ? (
        <div className="bg-[#CC0C39] text-white text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
          <Zap size={10} /> {activeDeal.discount_percent}% OFF
        </div>
      ) : bestSeller ? (
        <div className="bg-[#E47911] text-white text-[10px] font-bold px-2 py-0.5">
          Mais vendido
        </div>
      ) : null}

      <div className="aspect-square bg-white p-3 flex items-center justify-center overflow-hidden relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
          loading="lazy"
        />
        {onToggleWishlist && (
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(e); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onToggleWishlist(e as unknown as React.MouseEvent); } }}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-md hover:bg-white transition-colors z-10"
          >
            <Heart
              size={16}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </div>
        )}
      </div>

      <div className="p-3 pt-1 flex flex-col gap-1 flex-1 border-t border-gray-100">
        <p className="text-sm text-gray-900 leading-tight line-clamp-2 group-hover:text-[#C45500] transition-colors">
          {product.name}
        </p>

        <p className="text-[11px] text-gray-500">{product.brand}</p>

        <StarRating rating={rating} reviews={reviews} />

        <div className="mt-auto pt-1">
          {activeDeal ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-[#CC0C39]">R$</span>
                <span className="text-xl font-bold text-[#CC0C39]">
                  {Math.floor(brl * (1 - activeDeal.discount_percent / 100)).toLocaleString("pt-BR")}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-through">
                R$ {brl.toFixed(2).replace(".", ",")}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-900">R$</span>
                <span className="text-xl font-bold text-gray-900">
                  {Math.floor(brl).toLocaleString("pt-BR")}
                </span>
                <span className="text-xs text-gray-900">
                  {(brl % 1).toFixed(2).slice(1).replace(".", ",")}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-through">
                R$ {prevPrice.toFixed(2).replace(".", ",")}
              </p>
            </>
          )}
          <p className="text-[11px] text-gray-500 mt-0.5">
            US$ {product.price_usd.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <div className="flex items-center gap-1 mt-1">
          <Truck size={12} className="text-[#007600]" />
          <span className="text-[11px] text-[#007600] font-medium">Entrega via viagem</span>
        </div>
      </div>
    </button>
  );
}
