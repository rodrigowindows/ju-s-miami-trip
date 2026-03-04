import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Heart, ShoppingCart, Truck, Loader2, Plus, Check, Share2, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import EmptyState from "@/components/shared/EmptyState";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useProductReviews, useCreateProductReview } from "@/hooks/useProductReviews";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist, useToggleWishlist } from "@/hooks/useWishlist";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { RecentlyViewed } from "@/components/catalog/RecentlyViewed";
import type { CatalogProduct } from "@/types";
import { toast } from "sonner";
import { calculatePriceBRL } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import { StarRating } from "@/components/catalog/StarRating";
import { fakeRating, isBestSeller, fakePreviousPrice } from "@/components/catalog/catalog-utils";
import { shareProductWhatsApp } from "@/lib/share";
import { useSearchTracker } from "@/hooks/useSearchTracker";

function getRating(product: CatalogProduct) {
  if (product.review_count > 0) {
    return { rating: Number(product.rating) || 0, reviews: product.review_count };
  }
  return fakeRating(product.name);
}

function ClickableStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="p-0.5"
        >
          <Star
            size={20}
            className={i < value ? "fill-amber-400 text-amber-400" : "text-gray-300 hover:text-amber-300"}
          />
        </button>
      ))}
    </div>
  );
}

export default function ClientCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "Todos";
  const { data: products, isLoading } = useCatalogProducts(category);
  const { data: settings } = useSettings();
  const { user, profile } = useAuth();
  const { addItem, items, openCart } = useCart();
  const { data: wishlistIds } = useWishlist(user?.id);
  const toggleWishlist = useToggleWishlist();
  const { recentIds, addViewed } = useRecentlyViewed();

  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const searchQuery = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [justAdded, setJustAdded] = useState<string | null>(null);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const { data: productReviews, isLoading: reviewsLoading } = useProductReviews(selected?.id ?? null);
  const createReview = useCreateProductReview();
  const trackSearch = useSearchTracker("client", user?.id);

  const exchangeRate = Number(settings?.exchange_rate ?? "5.80");
  const spread = Number(settings?.spread_percent ?? "45");

  const calcBRL = useMemo(() => (usd: number) => calculatePriceBRL(usd, exchangeRate, spread), [exchangeRate, spread]);

  const isInCart = (productId: string) => items.some((i) => i.product.id === productId);

  const filtered = useMemo(() => {
    let list = products ?? [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price_asc":
        return [...list].sort((a, b) => a.price_usd - b.price_usd);
      case "price_desc":
        return [...list].sort((a, b) => b.price_usd - a.price_usd);
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, searchQuery, sortBy]);

  // Track search queries
  useEffect(() => {
    if (searchQuery.trim()) {
      trackSearch(searchQuery, filtered.length);
    }
  }, [searchQuery, filtered.length, trackSearch]);

  const handleToggleWishlist = (productId: string) => {
    if (!user) return;
    const wishlisted = (wishlistIds ?? []).includes(productId);
    toggleWishlist.mutate(
      { clientId: user.id, productId, wishlisted },
      { onSuccess: () => toast.success(wishlisted ? "Removido dos desejos" : "Adicionado aos desejos!") }
    );
  };

  const handleSelectProduct = (product: CatalogProduct) => {
    addViewed(product.id);
    setSelected(product);
  };

  const handleAddToCart = (product: CatalogProduct) => {
    addItem(product);
    setJustAdded(product.id);
    toast.success("Adicionado ao carrinho!");
    setTimeout(() => setJustAdded(null), 1500);
  };

  const handleSubmitReview = async () => {
    if (!user || !profile || !selected || reviewRating === 0) return;
    try {
      await createReview.mutateAsync({
        product_id: selected.id,
        client_id: user.id,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
        reviewer_name: profile.full_name?.split(" ")[0] ?? "Cliente",
      });
      setReviewRating(0);
      setReviewComment("");
      toast.success("Avaliação enviada!");
    } catch {
      toast.error("Erro ao enviar avaliação.");
    }
  };

  return (
    <div className="space-y-0 -mx-4 -mt-4">
      {/* Recently Viewed */}
      {recentIds.length > 0 && (
        <RecentlyViewed
          productIds={recentIds}
          calcBRL={calcBRL}
          onSelect={handleSelectProduct}
        />
      )}

      {/* Results Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          {isLoading ? "Carregando..." : (
            <>
              <span className="font-bold text-[#C45500]">{filtered.length}</span>{" "}
              resultado{filtered.length !== 1 ? "s" : ""}
              {category !== "Todos" && (
                <> em <span className="font-semibold">{category}</span></>
              )}
            </>
          )}
        </p>
        <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {/* Product Grid */}
      <div className="bg-[#EAEDED] px-3 py-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg p-8">
            <EmptyState
              icon="orders"
              title="Nenhum produto encontrado"
              description={searchQuery ? "Tente outra busca." : "Novos produtos serão adicionados em breve!"}
            />
            {searchQuery && (
              <div className="text-center mt-2">
                <button
                  onClick={() => { const p = new URLSearchParams(searchParams); p.delete("q"); setSearchParams(p); }}
                  className="text-sm text-sky-700 hover:underline"
                >
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                brl={calcBRL(p.price_usd)}
                onClick={() => handleSelectProduct(p)}
                onAddToCart={() => handleAddToCart(p)}
                wishlisted={(wishlistIds ?? []).includes(p.id)}
                onToggleWishlist={() => handleToggleWishlist(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); setReviewRating(0); setReviewComment(""); } }}>
        <DialogContent className="max-w-md mx-auto p-0 gap-0 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
          {selected && (() => {
            const { rating, reviews } = getRating(selected);
            const brl = calcBRL(selected.price_usd);
            const bestSeller = isBestSeller(selected.name);
            const prevPrice = fakePreviousPrice(brl, selected.name);
            const inCart = isInCart(selected.id);
            const wasJustAdded = justAdded === selected.id;

            return (
              <>
                <div className="bg-white relative">
                  <div className="aspect-square bg-white p-6 flex items-center justify-center">
                    <img
                      src={selected.image_url}
                      alt={selected.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
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
                    onClick={() => handleToggleWishlist(selected.id)}
                    className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors"
                  >
                    <Heart
                      size={20}
                      className={(wishlistIds ?? []).includes(selected.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
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
                      <DialogDescription className="sr-only">Detalhes do produto {selected.name}</DialogDescription>
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
                    <p className="text-base text-[#999] line-through">
                      R$ {prevPrice.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[28px] font-bold text-gray-900">
                        {formatBRL(brl)}
                      </span>
                      <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        -{Math.round(((prevPrice - brl) / prevPrice) * 100)}% OFF
                      </span>
                    </div>
                    <p className="text-sm text-[#28a745] font-medium mt-0.5">
                      Economize {formatBRL(prevPrice - brl)}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-3 mt-2 space-y-1.5">
                      <p className="text-sm text-gray-700">1x de <span className="font-semibold">{formatBRL(brl)}</span> sem juros</p>
                      <p className="text-sm text-gray-700">2x de <span className="font-semibold">{formatBRL(brl / 2)}</span> sem juros</p>
                      <p className="text-sm text-gray-700">3x de <span className="font-semibold">{formatBRL(brl / 3)}</span> sem juros</p>
                    </div>

                    <p className="text-sm text-gray-400 mt-2">
                      Preco nos EUA: US$ {selected.price_usd.toFixed(2)}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-3 mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cambio</span>
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

                  {/* Reviews Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={16} className="text-[#007185]" />
                      <h3 className="font-semibold text-sm text-gray-900">
                        Avaliações de clientes
                      </h3>
                      {(productReviews?.length ?? 0) > 0 && (
                        <Badge variant="secondary" className="text-[10px]">{productReviews!.length}</Badge>
                      )}
                    </div>

                    {/* Review form */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 space-y-2">
                      <p className="text-xs font-medium text-gray-700">Avaliar este produto</p>
                      <ClickableStars value={reviewRating} onChange={setReviewRating} />
                      <textarea
                        placeholder="Escreva sua avaliação (opcional)..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007185] resize-none"
                        rows={2}
                      />
                      <Button
                        size="sm"
                        disabled={reviewRating === 0 || createReview.isPending}
                        onClick={handleSubmitReview}
                        className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 px-4 h-auto py-1.5 border border-[#FCD200] text-xs"
                      >
                        {createReview.isPending ? <Loader2 size={14} className="animate-spin" /> : "Enviar avaliação"}
                      </Button>
                    </div>

                    {/* Reviews list */}
                    {reviewsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    ) : !productReviews || productReviews.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-3">
                        Nenhuma avaliação ainda. Seja o primeiro a avaliar!
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {productReviews.map((r) => (
                          <div key={r.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={11}
                                    className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-semibold text-gray-900">{r.reviewer_name}</span>
                              {r.verified_purchase && (
                                <Badge variant="secondary" className="text-[9px] bg-green-50 text-green-700 border-green-200">
                                  Compra verificada
                                </Badge>
                              )}
                            </div>
                            {r.comment && (
                              <p className="text-xs text-gray-700 mt-1">{r.comment}</p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(r.created_at).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(selected)}
                      className={`flex-1 rounded-full font-medium transition-all ${
                        wasJustAdded
                          ? "bg-[#007600] hover:bg-[#007600] text-white"
                          : "bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-[#FCD200]"
                      }`}
                    >
                      {wasJustAdded ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Adicionado!
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar ao carrinho
                        </>
                      )}
                    </Button>
                    {inCart && !wasJustAdded && (
                      <Button
                        onClick={() => { setSelected(null); openCart(); }}
                        variant="outline"
                        className="rounded-full border-[#131921] text-[#131921]"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    )}
                    <Button
                      onClick={() => shareProductWhatsApp(selected, brl)}
                      variant="outline"
                      className="rounded-full text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10 px-3"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
