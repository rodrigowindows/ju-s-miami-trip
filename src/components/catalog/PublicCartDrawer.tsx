import { X, Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWhatsAppCheckout } from "@/hooks/useWhatsAppCheckout";
import { ProductImage } from "./ProductImage";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PublicCartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, totalItems } = useCart();
  const { checkoutCartViaWhatsApp, calcBRL } = useWhatsAppCheckout();

  if (!open) return null;

  const grandTotal = items.reduce((s, i) => s + calcBRL(i.product.price_usd) * i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag size={18} />
            Carrinho ({totalItems})
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Carrinho vazio</p>
              <p className="text-sm mt-1">Adicione produtos para continuar</p>
            </div>
          ) : (
            items.map(({ product, quantity }) => {
              const brl = calcBRL(product.price_usd);
              return (
                <div key={product.id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-white">
                    <ProductImage src={product.image_url} alt={product.name} brand={product.brand} category={product.category} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brand}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      R$ {(brl * quantity).toFixed(2).replace(".", ",")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100">
                        <Plus size={12} />
                      </button>
                      <button onClick={() => removeItem(product.id)} className="ml-auto text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>R$ {grandTotal.toFixed(2).replace(".", ",")}</span>
            </div>
            <button
              onClick={() => {
                checkoutCartViaWhatsApp();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold text-sm transition-colors"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={18} />
              Finalizar pedido via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
