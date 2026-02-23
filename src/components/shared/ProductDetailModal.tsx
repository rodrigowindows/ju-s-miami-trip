import { Link } from "react-router-dom";
import type { CatalogProduct } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, Truck, ShoppingBag, ChevronRight, Flame } from "lucide-react";
import { fakeRating, isBestSeller, fakeDiscount, StarRating } from "@/lib/product-display";
import { formatBRL } from "@/lib/format";

interface Props {
  product: CatalogProduct | null;
  onClose: () => void;
  convert: (usd: number) => number;
}

export default function ProductDetailModal({ product, onClose, convert }: Props) {
  if (!product) return null;

  const { rating, reviews } = fakeRating(product.name);
  const best = isBestSeller(product.name);
  const discount = fakeDiscount(product.name);
  const brl = convert(product.price_usd);
  const originalPrice = brl / (1 - discount / 100);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md mx-auto p-0 gap-0 rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Image */}
        <div className="bg-white relative">
          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 text-gray-600 rounded-full p-1.5 shadow-md hover:bg-white"
          >
            <X size={16} />
          </button>
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
            {best && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <Flame size={10} />
                HOT
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-3 bg-white">
          <div>
            <Badge variant="secondary" className="text-[10px] font-medium mb-2">
              {product.category}
            </Badge>
            <DialogHeader>
              <DialogTitle className="text-base font-normal text-gray-900 leading-snug">
                {product.name}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-rose-500 mt-1 font-medium">{product.brand}</p>
          </div>

          <StarRating rating={rating} count={reviews} />

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Pricing */}
          <div className="bg-rose-50 rounded-xl p-4 space-y-1">
            <p className="text-xs text-gray-400 line-through">{formatBRL(originalPrice)}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{formatBRL(brl)}</span>
              <span className="bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            </div>
            <p className="text-sm text-gray-500">US$ {product.price_usd.toFixed(2)}</p>

            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-rose-100">
              <Truck size={14} className="text-green-600" />
              <span className="text-xs text-green-600 font-medium">Entrega via viagem Miami</span>
            </div>
          </div>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full py-3 px-4 font-medium text-sm transition-colors"
          >
            <ShoppingBag size={16} />
            Fazer login para comprar
          </Link>

          <Link
            to="/catalog"
            className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-rose-500 transition-colors pt-1"
          >
            Ver catalogo completo
            <ChevronRight size={14} />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
