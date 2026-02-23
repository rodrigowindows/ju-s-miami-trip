import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { CatalogProduct, ProductReview } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  X,
  ArrowLeft,
  LogIn,
  Star,
  TrendingUp,
  Flame,
  ShoppingBag,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import Logo from "@/components/shared/Logo";

const CATEGORIES = ["Todos", "Tech", "Beauty", "Fashion", "Supplements"] as const;

type SortTab = "todos" | "mais_vendidos" | "trending";

function useCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("catalog_products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      setProducts((data as CatalogProduct[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return { products, loading };
}

function useReviews(productId: string | null) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) {
      setReviews([]);
      return;
    }
    setLoading(true);
    supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReviews((data as ProductReview[]) ?? []);
        setLoading(false);
      });
  }, [productId]);

  return { reviews, loading };
}

function useExchangeRate() {
  const [effectiveRate, setEffectiveRate] = useState(6.05 * 1.08);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.functions.invoke("get-exchange-rate");
      if (!error && data) {
        setEffectiveRate(data.effective_rate);
      }
    }
    load();
  }, []);

  function convert(usd: number) {
    return usd * effectiveRate;
  }

  return { convert };
}

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

export default function PublicCatalog() {
  const { products, loading } = useCatalog();
  const { convert } = useExchangeRate();

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [activeTab, setActiveTab] = useState<SortTab>("todos");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const { reviews, loading: reviewsLoading } = useReviews(selectedProduct?.id ?? null);

  const filtered = useMemo(() => {
    let list = products;

    // Category filter
    if (activeCategory !== "Todos") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Sort tab
    if (activeTab === "mais_vendidos") {
      list = [...list].sort((a, b) => b.sales_count - a.sales_count);
    } else if (activeTab === "trending") {
      list = list.filter((p) => p.trending);
    }

    return list;
  }, [products, activeCategory, activeTab]);

  const sortTabs: { key: SortTab; label: string; icon: typeof ShoppingBag }[] = [
    { key: "todos", label: "Todos", icon: ShoppingBag },
    { key: "mais_vendidos", label: "Mais Vendidos", icon: Flame },
    { key: "trending", label: "Trending", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={20} />
            </Link>
            <Logo size="sm" />
          </div>
          <Link
            to="/login"
            className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            <LogIn size={14} />
            Entrar
          </Link>
        </div>

        <h1 className="font-display text-xl font-bold text-foreground">Vitrine</h1>
        <p className="text-xs text-muted-foreground mb-3">
          Produtos populares dos EUA
        </p>

        {/* Sort tabs */}
        <div className="flex gap-1 mb-2">
          {sortTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-violet-600 text-white"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Product Grid */}
      <main className="px-4 pt-4 pb-8 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            {activeTab === "trending" ? (
              <>
                <TrendingUp size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Nenhum produto em alta nesta categoria.</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
            )}
          </div>
        ) : (
          <>
            {/* Count + sort info */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">
                {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
              </p>
              {activeTab === "mais_vendidos" && (
                <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                  <Flame size={12} />
                  Ordenados por vendas
                </p>
              )}
              {activeTab === "trending" && (
                <p className="text-xs text-violet-600 font-medium flex items-center gap-1">
                  <TrendingUp size={12} />
                  Em alta agora
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filtered.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-xl border border-border overflow-hidden text-left hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-square bg-muted/50 relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.trending && (
                        <Badge className="bg-violet-600 text-white text-[9px] border-0 gap-0.5 px-1.5">
                          <TrendingUp size={9} />
                          Trending
                        </Badge>
                      )}
                      {product.sales_count >= 150 && (
                        <Badge className="bg-amber-500 text-white text-[9px] border-0 gap-0.5 px-1.5">
                          <Flame size={9} />
                          Best Seller
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                      {product.brand}
                    </p>
                    <p className="text-sm font-semibold text-foreground leading-tight mt-0.5 line-clamp-2">
                      {product.name}
                    </p>

                    {/* Stars + review count */}
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              className={
                                s <= Math.round(product.rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-semibold text-foreground">{product.rating}</span>
                        {product.review_count > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            ({product.review_count})
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs text-muted-foreground">
                        US$ {product.price_usd.toFixed(2)}
                      </p>
                      <p className="text-sm font-bold text-violet-600">
                        R$ {convert(product.price_usd).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-sm mx-auto p-0 gap-0 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <div className="aspect-square bg-muted/50 relative">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5"
                >
                  <X size={16} />
                </button>
                {/* Badges on image */}
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {selectedProduct.trending && (
                    <Badge className="bg-violet-600 text-white text-[10px] border-0 gap-1">
                      <TrendingUp size={10} />
                      Trending
                    </Badge>
                  )}
                  {selectedProduct.sales_count >= 150 && (
                    <Badge className="bg-amber-500 text-white text-[10px] border-0 gap-1">
                      <Flame size={10} />
                      Best Seller
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="text-[10px] font-medium mb-2">
                      {selectedProduct.category}
                    </Badge>
                    {/* Rating */}
                    {selectedProduct.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <StarRating rating={selectedProduct.rating} size={11} />
                        <span className="text-xs font-semibold">{selectedProduct.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {selectedProduct.brand}
                  </p>
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl mt-1">
                      {selectedProduct.name}
                    </DialogTitle>
                  </DialogHeader>
                </div>

                {/* Sales social proof */}
                {selectedProduct.sales_count > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    <ShoppingBag size={14} className="text-violet-600" />
                    <span>
                      <strong className="text-foreground">{selectedProduct.sales_count}</strong> pessoas ja compraram
                    </span>
                  </div>
                )}

                {selectedProduct.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProduct.description}
                  </p>
                )}

                <div className="flex items-end gap-3 pt-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Preco EUA</p>
                    <p className="text-lg font-semibold">
                      US$ {selectedProduct.price_usd.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estimativa Brasil</p>
                    <p className="text-lg font-bold text-violet-600">
                      R$ {convert(selectedProduct.price_usd).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>

                {/* Reviews section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle size={16} className="text-violet-600" />
                    <h3 className="font-semibold text-sm">
                      Avaliacoes de clientes
                    </h3>
                    {reviews.length > 0 && (
                      <Badge variant="secondary" className="text-[10px]">{reviews.length}</Badge>
                    )}
                  </div>

                  {/* Rating summary bar */}
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-3 mb-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">{selectedProduct.rating}</p>
                        <StarRating rating={selectedProduct.rating} size={12} />
                        <p className="text-[10px] text-muted-foreground mt-0.5">{reviews.length} avaliacoes</p>
                      </div>
                      <div className="flex-1 space-y-0.5">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = reviews.filter((r) => r.rating === star).length;
                          const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-1.5">
                              <span className="text-[10px] text-muted-foreground w-3 text-right">{star}</span>
                              <Star size={8} className="text-amber-400 fill-amber-400 shrink-0" />
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground w-4">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {reviewsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-3">
                      Nenhuma avaliacao ainda.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-muted/30 rounded-lg p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {review.reviewer_name.charAt(0)}
                              </div>
                              <span className="text-xs font-semibold">{review.reviewer_name}</span>
                              {review.verified_purchase && (
                                <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-medium">
                                  <CheckCircle2 size={10} />
                                  Verificada
                                </span>
                              )}
                            </div>
                          </div>
                          <StarRating rating={review.rating} size={10} />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full py-2.5 px-4 font-medium text-sm mt-2 transition-colors"
                >
                  <LogIn size={16} />
                  Fazer login para comprar
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
