import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlistProducts, useToggleWishlist } from "@/hooks/useWishlist";
import { useSettings } from "@/hooks/useSettings";
import { calculatePriceBRL } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";
import { toast } from "sonner";
import type { CatalogProduct } from "@/types";

export default function ClientWishlist() {
  const { user } = useAuth();
  const { data: wishlistItems, isLoading } = useWishlistProducts(user?.id);
  const toggleWishlist = useToggleWishlist();
  const { addItem } = useCart();
  const { data: settings } = useSettings();

  const exchangeRate = Number(settings?.exchange_rate ?? "5.80");
  const spread = Number(settings?.spread_percent ?? "45");
  const calcBRL = (usd: number) => calculatePriceBRL(usd, exchangeRate, spread);

  const handleRemove = (productId: string) => {
    if (!user) return;
    toggleWishlist.mutate(
      { clientId: user.id, productId, wishlisted: true },
      { onSuccess: () => toast.success("Removido da lista de desejos") }
    );
  };

  const handleAddToCart = (product: CatalogProduct) => {
    addItem(product);
    toast.success("Adicionado ao carrinho!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
        <h1 className="text-lg font-bold">Lista de Desejos</h1>
        {wishlistItems && wishlistItems.length > 0 && (
          <span className="text-sm text-muted-foreground">
            ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "itens"})
          </span>
        )}
      </div>

      {!wishlistItems || wishlistItems.length === 0 ? (
        <EmptyState
          icon="orders"
          title="Sua lista de desejos esta vazia"
          description="Explore o catalogo e toque no coracao para salvar produtos aqui."
        />
      ) : (
        <div className="space-y-3">
          {wishlistItems.map((item) => {
            const brl = calcBRL(item.product.price_usd);
            return (
              <div
                key={item.product_id}
                className="bg-white rounded-lg border border-gray-200 p-3 flex gap-3"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-1">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.product.brand}</p>
                  <p className="text-base font-bold text-gray-900 mt-1">{formatBRL(brl)}</p>
                  <p className="text-[11px] text-gray-500">
                    US$ {item.product.price_usd.toFixed(2).replace(".", ",")}
                  </p>

                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item.product)}
                      className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-[#FCD200] text-xs h-8"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      Quero este produto
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(item.product_id)}
                      className="text-gray-400 hover:text-red-500 h-8 px-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
