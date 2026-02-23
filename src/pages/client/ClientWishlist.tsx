import { useState } from "react";
import { Heart, ShoppingBag, Trash2, Truck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import { useWishlistProducts, useToggleWishlist, useWishlistIds } from "@/hooks/useWishlist";
import { useCreateOrder, useCreateOrderItem } from "@/hooks/useOrders";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { calculatePriceBRL } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";
import { StarRating } from "@/components/catalog/StarRating";
import { fakeRating, isBestSeller, fakePreviousPrice } from "@/components/catalog/catalog-utils";
import type { CatalogProduct } from "@/types";
import { toast } from "sonner";

export default function ClientWishlist() {
  const { data: products, isLoading } = useWishlistProducts();
  const { data: wishlistIds = [] } = useWishlistIds();
  const toggleWishlist = useToggleWishlist();
  const { data: settings } = useSettings();
  const { user, profile } = useAuth();
  const createOrder = useCreateOrder();
  const createOrderItem = useCreateOrderItem();

  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const [ordering, setOrdering] = useState(false);

  const exchangeRate = Number(settings?.exchange_rate ?? "5.70");
  const spread = Number(settings?.spread_percent ?? "3");
  const calcBRL = (usd: number) => calculatePriceBRL(usd, exchangeRate, spread);

  const handleRemove = (productId: string) => {
    toggleWishlist.mutate({ productId, isWished: true });
    if (selected?.id === productId) setSelected(null);
    toast.success("Removido da lista de desejos");
  };

  const handleOrder = async () => {
    if (!user || !profile || !selected) return;
    setOrdering(true);
    try {
      const totalUsd = selected.price_usd;
      const totalBrl = calcBRL(totalUsd);
      const deposit = totalBrl * 0.5;

      const order = await createOrder.mutateAsync({
        client_id: user.id,
        customer_name: profile.full_name ?? "",
        customer_phone: profile.phone ?? undefined,
        items: selected.name,
        total_usd: totalUsd,
        total_brl: totalBrl,
        total_amount: totalBrl,
        deposit_amount: deposit,
      });

      await createOrderItem.mutateAsync({
        order_id: order.id,
        product_name: selected.name,
        product_image_url: selected.image_url,
        price_usd: totalUsd,
        price_brl: totalBrl,
      });

      setSelected(null);
      toast.success("Pedido criado! Acompanhe em Meus Pedidos.");
    } catch {
      toast.error("Erro ao criar pedido.");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="space-y-0 -mx-4 -mt-4">
      {/* Header */}
      <div className="bg-[#232F3E] px-4 py-3 flex items-center gap-2">
        <Heart className="h-5 w-5 text-white fill-white" />
        <h1 className="text-white font-semibold text-lg">Lista de Desejos</h1>
        {products && products.length > 0 && (
          <span className="bg-white/20 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-auto">
            {products.length}
          </span>
        )}
      </div>

      <div className="bg-[#EAEDED] px-3 py-3 min-h-[60vh]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : !products || products.length === 0 ? (
          <div className="bg-white rounded-lg p-8">
            <EmptyState
              icon="orders"
              title="Sua lista de desejos está vazia"
              description="Navegue pela vitrine e toque no coração para salvar produtos aqui!"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const brl = calcBRL(product.price_usd);
              const { rating, reviews } = fakeRating(product.name);
              const prevPrice = fakePreviousPrice(brl, product.name);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden flex"
                >
                  <button
                    onClick={() => setSelected(product)}
                    className="w-28 shrink-0 bg-white p-2 flex items-center justify-center"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="max-w-full max-h-24 object-contain"
                      loading="lazy"
                    />
                  </button>

                  <div className="flex-1 p-3 flex flex-col gap-1 min-w-0">
                    <button
                      onClick={() => setSelected(product)}
                      className="text-left"
                    >
                      <p className="text-sm text-gray-900 leading-tight line-clamp-2 hover:text-[#C45500] transition-colors">
                        {product.name}
                      </p>
                    </button>

                    <p className="text-[11px] text-gray-500">{product.brand}</p>
                    <StarRating rating={rating} reviews={reviews} />

                    <div className="flex items-baseline gap-1 mt-auto">
                      <span className="text-xs text-gray-900">R$</span>
                      <span className="text-lg font-bold text-gray-900">
                        {Math.floor(brl).toLocaleString("pt-BR")}
                      </span>
                      <span className="text-xs text-gray-500 line-through ml-1">
                        R$ {prevPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleRemove(product.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remover
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-[#FCD200]"
                        onClick={() => setSelected(product)}
                      >
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Comprar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md mx-auto p-0 gap-0 rounded-lg max-h-[90vh] overflow-y-auto">
          {selected && (() => {
            const { rating, reviews } = fakeRating(selected.name);
            const brl = calcBRL(selected.price_usd);
            const bestSeller = isBestSeller(selected.name);
            const prevPrice = fakePreviousPrice(brl, selected.name);
            const isWished = wishlistIds.includes(selected.id);

            return (
              <>
                <div className="bg-white relative">
                  <div className="aspect-square bg-white p-6 flex items-center justify-center">
                    <img
                      src={selected.image_url}
                      alt={selected.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  {bestSeller && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#E47911] text-white text-xs font-bold px-2 py-1 rounded">
                        Mais vendido
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      toggleWishlist.mutate({ productId: selected.id, isWished })
                    }
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md"
                  >
                    <Heart
                      className={`h-5 w-5 ${isWished ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                </div>

                <div className="p-5 space-y-3 bg-white">
                  <div>
                    <Badge variant="secondary" className="text-[10px] font-medium mb-2">
                      {selected.category}
                    </Badge>
                    <DialogHeader>
                      <DialogTitle className="text-base font-normal text-gray-900 leading-snug">
                        {selected.name}
                      </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-sky-700 mt-1">
                      Loja: {selected.brand}
                    </p>
                  </div>

                  <StarRating rating={rating} reviews={reviews} />

                  {selected.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selected.description}
                    </p>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500 line-through">
                      R$ {prevPrice.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatBRL(brl)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      US$ {selected.price_usd.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Câmbio</span>
                        <span className="text-gray-700">{exchangeRate.toFixed(2).replace(".", ",")} + {spread}%</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Sinal (50%)</span>
                        <span className="text-[#007600]">{formatBRL(brl * 0.5)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-3">
                      <Truck size={14} className="text-[#007600]" />
                      <span className="text-sm text-[#007600] font-medium">Entrega via viagem Miami</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleOrder}
                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-full border border-[#FCD200] font-medium"
                    disabled={ordering}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {ordering ? "Criando pedido..." : "Quero este produto"}
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
