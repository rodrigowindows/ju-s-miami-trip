import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useSettings } from "@/hooks/useSettings";
import { calculatePriceBRL } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";
import EmptyState from "@/components/shared/EmptyState";

export default function ClientCart() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const { data: settings } = useSettings();
  const [ordering] = useState(false);

  const exchangeRate = Number(settings?.exchange_rate ?? "5.80");
  const spread = Number(settings?.spread_percent ?? "45");
  const calcBRL = (usd: number) => calculatePriceBRL(usd, exchangeRate, spread);

  const totalUSD = items.reduce((sum, i) => sum + i.product.price_usd * i.quantity, 0);
  const totalBRL = items.reduce((sum, i) => sum + calcBRL(i.product.price_usd) * i.quantity, 0);
  const deposit = totalBRL * 0.5;



  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Link to="/client/catalog" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-display text-lg font-bold">Carrinho</h1>
        </div>
        <EmptyState
          icon="orders"
          title="Carrinho vazio"
          description="Adicione produtos da vitrine ao seu carrinho."
        />
        <Link to="/client/catalog">
          <Button className="w-full" variant="outline">Ir para a vitrine</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-3">
        <Link to="/client/catalog" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-lg font-bold">
          Carrinho ({items.reduce((s, i) => s + i.quantity, 0)} {items.length === 1 ? "item" : "itens"})
        </h1>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const brl = calcBRL(item.product.price_usd);
          return (
            <Card key={item.product.id}>
              <CardContent className="p-3 flex gap-3">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-2 leading-tight font-medium">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.product.brand}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-bold text-gray-900">{formatBRL(brl * item.quantity)}</span>
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-gray-500">({formatBRL(brl)} cada)</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">US$ {(item.product.price_usd * item.quantity).toFixed(2)}</p>
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <h3 className="font-semibold text-sm">Resumo do pedido</h3>
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
            onClick={() => window.location.assign("/client/checkout")}
            disabled={ordering}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-full border border-[#FCD200] font-medium h-11"
          >
            {ordering ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ShoppingBag className="h-4 w-4 mr-2" />
            )}
            Ir para checkout
          </Button>

          <p className="text-[11px] text-gray-500 text-center">
            Valor do sinal (50%). Restante na entrega.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
