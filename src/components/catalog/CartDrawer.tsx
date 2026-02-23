import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useCreateOrder, useCreateOrderItem } from "@/hooks/useOrders";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { calculatePriceBRL } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";
import { toast } from "sonner";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, isOpen, closeCart, totalItems } = useCart();
  const { data: settings } = useSettings();
  const { user, profile } = useAuth();
  const createOrder = useCreateOrder();
  const createOrderItem = useCreateOrderItem();
  const [ordering, setOrdering] = useState(false);

  const exchangeRate = Number(settings?.exchange_rate ?? "5.70");
  const spread = Number(settings?.spread_percent ?? "3");
  const calcBRL = (usd: number) => calculatePriceBRL(usd, exchangeRate, spread);

  const totalUSD = items.reduce((sum, i) => sum + i.product.price_usd * i.quantity, 0);
  const totalBRL = items.reduce((sum, i) => sum + calcBRL(i.product.price_usd) * i.quantity, 0);
  const deposit = totalBRL * 0.5;

  async function handleCheckout() {
    if (!user || !profile || items.length === 0) return;
    setOrdering(true);
    try {
      const itemNames = items.map((i) => `${i.product.name}${i.quantity > 1 ? ` (x${i.quantity})` : ""}`).join(", ");

      const order = await createOrder.mutateAsync({
        client_id: user.id,
        customer_name: profile.full_name ?? "",
        customer_phone: profile.phone ?? undefined,
        items: itemNames,
        total_usd: totalUSD,
        total_brl: totalBRL,
        total_amount: totalBRL,
        deposit_amount: deposit,
      });

      for (const item of items) {
        await createOrderItem.mutateAsync({
          order_id: order.id,
          product_name: item.product.name,
          product_image_url: item.product.image_url,
          quantity: item.quantity,
          price_usd: item.product.price_usd * item.quantity,
          price_brl: calcBRL(item.product.price_usd) * item.quantity,
        });
      }

      clearCart();
      closeCart();
      toast.success("Pedido criado! Acompanhe em Meus Pedidos.");
    } catch {
      toast.error("Erro ao criar pedido.");
    } finally {
      setOrdering(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-[#131921] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="font-semibold text-base">
              Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
            </h2>
          </div>
          <button onClick={closeCart} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 px-6">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-sm">Seu carrinho esta vazio</p>
              <Button variant="outline" size="sm" onClick={closeCart}>
                Continuar comprando
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const brl = calcBRL(item.product.price_usd);
                return (
                  <div key={item.product.id} className="flex gap-3 p-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-2 leading-tight">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.product.brand}</p>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-sm font-bold text-gray-900">{formatBRL(brl * item.quantity)}</span>
                        {item.quantity > 1 && (
                          <span className="text-[11px] text-gray-500">({formatBRL(brl)} cada)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium bg-gray-50 min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (USD)</span>
                <span>US$ {totalUSD.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Cambio + {spread}%</span>
                <span>{exchangeRate.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-200">
                <span>Total</span>
                <span>{formatBRL(totalBRL)}</span>
              </div>
              <div className="flex justify-between text-[#007600] font-semibold">
                <span>Sinal (50%)</span>
                <span>{formatBRL(deposit)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-[#007600]" />
              <span className="text-xs text-[#007600] font-medium">Entrega via viagem Miami</span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={ordering}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-full border border-[#FCD200] font-medium h-11"
            >
              {ordering ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ShoppingBag className="h-4 w-4 mr-2" />
              )}
              {ordering ? "Finalizando..." : `Finalizar pedido - ${formatBRL(deposit)}`}
            </Button>

            <p className="text-[11px] text-gray-500 text-center">
              Valor do sinal (50%). Restante na entrega.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
