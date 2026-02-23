import type { CatalogProduct } from "@/types";
import { Truck, Flame } from "lucide-react";
import { fakeRating, isBestSeller, fakeDiscount, StarRating } from "@/lib/product-display";
import { formatBRL } from "@/lib/format";

interface Props {
  product: CatalogProduct;
  priceBRL: number;
  onClick: () => void;
}

export default function ProductCard({ product, priceBRL, onClick }: Props) {
  const { rating, reviews } = fakeRating(product.name);
  const bestSeller = isBestSeller(product.name);
  const discount = fakeDiscount(product.name);
  const originalPrice = priceBRL / (1 - discount / 100);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden text-left hover:shadow-md transition-all group flex flex-col"
    >
      {/* Image */}
      <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-1.5 left-1.5">
          <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        </div>
        {bestSeller && (
          <div className="absolute top-1.5 right-1.5">
            <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Flame size={8} />
              HOT
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <p className="text-xs text-gray-800 leading-tight line-clamp-2">{product.name}</p>

        <div className="mt-auto pt-1">
          <p className="text-sm font-bold text-gray-900">{formatBRL(priceBRL)}</p>
          <p className="text-[10px] text-gray-400 line-through">{formatBRL(originalPrice)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            US$ {product.price_usd.toFixed(2)}
          </p>
        </div>

        <StarRating rating={rating} count={reviews} />

        <div className="flex items-center gap-1 mt-0.5">
          <Truck size={10} className="text-green-600" />
          <span className="text-[9px] text-green-600 font-medium">Frete viagem</span>
        </div>
      </div>
    </button>
  );
}
