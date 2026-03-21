import { Link, Navigate } from "react-router-dom";
import { ChevronRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlistProducts, useToggleWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/contexts/CartContext";
import { useWhatsAppCheckout } from "@/hooks/useWhatsAppCheckout";
import { ProductImage } from "@/components/catalog/ProductImage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

export default function Favoritos() {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) return <Navigate to="/login" replace />;

  const { data: wishlistItems = [], isLoading } = useWishlistProducts(user.id);
  const toggleWishlist = useToggleWishlist();
  const { addItem } = useCart();
  const { calcBRL } = useWhatsAppCheckout();

  const handleRemove = (productId: string) => {
    toggleWishlist.mutate({ clientId: user.id, productId, wishlisted: true }, {
      onSuccess: () => toast({ title: "Removido dos favoritos" }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-1">
          <Link to="/" className="hover:underline hover:text-gray-700">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Meus Favoritos</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Heart size={24} className="text-rose-500" />
          Meus Favoritos ({wishlistItems.length})
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <Heart size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-600 font-medium">Nenhum favorito ainda</p>
            <p className="text-sm text-gray-400 mt-1">Explore o catálogo e favorite produtos!</p>
            <Link to="/" className="inline-block mt-4 text-rose-600 hover:underline text-sm font-medium">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlistItems.map(({ product }) => {
              if (!product) return null;
              const brl = calcBRL(product.price_usd);
              return (
                <div key={product.id} className="bg-white rounded-xl p-4 flex gap-4 border">
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                    <ProductImage src={product.image_url} alt={product.name} brand={product.brand} category={product.category} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-rose-500 font-medium uppercase">{product.brand}</p>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">R$ {brl.toFixed(2).replace(".", ",")}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="bg-[#F43F5E] hover:bg-[#E11D48] text-white gap-1 text-xs" onClick={() => { addItem(product); toast({ title: "Adicionado ao carrinho!" }); }}>
                        <ShoppingBag size={12} /> Comprar
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-500" onClick={() => handleRemove(product.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
