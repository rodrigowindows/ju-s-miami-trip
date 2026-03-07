import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { StarRating } from "./StarRating";
import { fakeRating, type ProductGroup } from "./catalog-utils";
import type { CatalogProduct } from "@/types";

interface GroupedProductCardProps {
  group: ProductGroup;
  convert: (usd: number) => number;
  onClick: (product: CatalogProduct) => void;
  activeDealMap?: Map<string, { discount_percent: number; deal_type: string }>;
}

export function GroupedProductCard({ group, convert, onClick, activeDealMap }: GroupedProductCardProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = group.variants[selectedIdx];
  const product = current.product;

  const brl = convert(product.price_usd);
  const { rating, reviews } = fakeRating(product.name);
  const activeDeal = activeDealMap?.get(product.id);
  const finalPrice = activeDeal ? brl * (1 - activeDeal.discount_percent / 100) : brl;

  const MAX_PILLS = 4;
  const visibleVariants = group.variants.slice(0, MAX_PILLS);
  const remaining = group.variants.length - MAX_PILLS;

  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white rounded-xl overflow-hidden text-left group/card flex flex-col cursor-pointer border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="aspect-square relative overflow-hidden bg-white">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          brand={product.brand}
          category={product.category}
          className="w-full h-full object-cover rounded-t-xl"
        />

        <span className="absolute top-2 left-2 bg-white/95 text-gray-700 text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
          {group.variants.length} fragrâncias
        </span>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-[11px] text-[#F43F5E] font-medium uppercase tracking-wide">{product.brand}</p>
        <p className="text-sm text-black leading-tight line-clamp-2" style={{ fontFamily: "Poppins, sans-serif" }}>
          {group.groupName}
        </p>

        {/* Variant pills */}
        <div className="flex flex-wrap gap-1 mt-1">
          {visibleVariants.map((v, i) => (
            <button
              key={v.product.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(i);
              }}
              className={`text-[9px] leading-tight px-1.5 py-0.5 rounded-full whitespace-nowrap border transition-colors ${
                i === selectedIdx
                  ? "bg-[#F43F5E] text-white border-[#F43F5E]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {v.variantName}
            </button>
          ))}
          {remaining > 0 && (
            <span className="text-[9px] text-gray-400 self-center whitespace-nowrap">+{remaining}</span>
          )}
        </div>

        <StarRating rating={rating} reviews={reviews} />

        <div className="mt-auto pt-1.5">
          <p className="text-lg font-bold text-black" style={{ fontFamily: "Poppins, sans-serif" }}>
            R$ {finalPrice.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-xs text-emerald-600 font-medium">à vista no PIX</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(product);
          }}
          className="w-full mt-2 bg-[#F43F5E] text-white rounded-md font-semibold text-sm flex items-center justify-center gap-1.5 hover:opacity-90 transition-colors h-11"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <ShoppingBag size={14} />
          VER OPÇÕES
        </button>
      </div>
    </div>
  );
}
