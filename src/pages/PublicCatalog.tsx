import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { CatalogProduct, ProductQuestion, ProductReview } from "@/types";
import type { Tables } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2, X, LogIn, Search, Star, Truck,
  HelpCircle, Send, User, CheckCircle2,
  Zap, Timer, Flame, Share2,
  MessageCircle, MessageSquare,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import TrustBadges from "@/components/TrustBadges";
import HowItWorks from "@/components/HowItWorks";
import { shareProductWhatsApp } from "@/lib/share";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import { StarRating } from "@/components/catalog/StarRating";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { ThemedProductSections } from "@/components/catalog/ThemedProductSections";
import { fakeRating, isBestSeller, fakePreviousPrice } from "@/components/catalog/catalog-utils";
import { PreSaleBanner, FreeShippingBanner } from "@/components/SectionBanners";

type ProductDeal = Tables<"product_deals">;
type DealWithProduct = ProductDeal & { product: CatalogProduct };

function useCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("catalog_products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      setProducts((data as CatalogProduct[]) ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { products, loading };
}

function useDeals() {
  const [deals, setDeals] = useState<DealWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("product_deals")
        .select("*, catalog_products(*)")
        .eq("active", true)
        .gte("ends_at", new Date().toISOString())
        .order("deal_type", { ascending: true });

      const mapped = (data ?? [])
        .filter((d: Record<string, unknown>) => d.catalog_products)
        .map((d: Record<string, unknown>) => ({
          ...d,
          product: d.catalog_products as CatalogProduct,
        })) as DealWithProduct[];

      setDeals(mapped);
      setLoading(false);
    }
    fetch();
  }, []);

  return { deals, loading };
}

function useCountdown(endsAt: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    function tick() {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Encerrado"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);
  return timeLeft;
}

function DealCard({
  deal,
  convert,
  onSelect,
}: {
  deal: DealWithProduct;
  convert: (usd: number) => number;
  onSelect: (p: CatalogProduct) => void;
}) {
  const countdown = useCountdown(deal.ends_at);
  const p = deal.product;
  const brl = convert(p.price_usd);
  const discounted = brl * (1 - deal.discount_percent / 100);
  const claimedPct = deal.max_claims ? Math.min(100, (deal.claimed_count / deal.max_claims) * 100) : 0;

  return (
    <button
      onClick={() => onSelect(p)}
      className="bg-white rounded-lg overflow-hidden text-left hover:shadow-lg transition-shadow group flex flex-col border border-gray-200 min-w-[160px] sm:min-w-[180px] max-w-[200px] shrink-0"
    >
      <div className="bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 flex items-center gap-1">
        {deal.deal_type === "lightning" ? <Zap size={12} /> : <Flame size={12} />}
        {deal.discount_percent}% OFF
      </div>

      <div className="aspect-square bg-white p-3 flex items-center justify-center overflow-hidden relative">
        <img
          src={p.image_url}
          alt={p.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>

      <div className="p-2.5 space-y-1.5 border-t border-gray-100">
        <p className="text-xs text-gray-900 leading-tight line-clamp-2">{p.name}</p>

        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-[#CC0C39]">
            R$ {discounted.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </span>
          <span className="text-[10px] text-gray-500 line-through">
            R$ {brl.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </span>
        </div>

        {deal.max_claims && (
          <div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#CC0C39] to-[#FF6138] transition-all"
                style={{ width: `${claimedPct}%` }}
              />
            </div>
            <p className="text-[9px] text-gray-500 mt-0.5">
              {deal.claimed_count} de {deal.max_claims} resgatados
            </p>
          </div>
        )}

        <div className="flex items-center gap-1 text-[10px] text-[#CC0C39] font-mono font-semibold">
          <Timer size={10} />
          {countdown}
        </div>
      </div>
    </button>
  );
}

function useQuestions(productId: string | null) {
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!productId) {
      setQuestions([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("product_questions")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    setQuestions((data as ProductQuestion[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [productId]);

  return { questions, loading, reload: load };
}

function useExchangeRate() {
  const [effectiveRate, setEffectiveRate] = useState(6.05 * 1.08);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase.functions.invoke("get-exchange-rate");
      if (!error && data) {
        setEffectiveRate(data.effective_rate);
      }
    }
    fetch();
  }, []);

  function convert(usd: number) {
    return usd * effectiveRate;
  }

  return { convert, effectiveRate };
}

function getRating(product: CatalogProduct) {
  if (product.review_count > 0) {
    return { rating: Number(product.rating) || 0, reviews: product.review_count };
  }
  // Fallback for products with no reviews yet
  return fakeRating(product.name);
}

function useProductReviewsLocal(productId: string | null) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) { setReviews([]); return; }
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

export default function PublicCatalog() {
  const { products, loading } = useCatalog();
  const { convert } = useExchangeRate();
  const { deals, loading: dealsLoading } = useDeals();

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("relevance");

  const { questions, loading: questionsLoading, reload: reloadQuestions } = useQuestions(selectedProduct?.id ?? null);
  const { reviews: productReviews, loading: reviewsLoading } = useProductReviewsLocal(selectedProduct?.id ?? null);
  const { toast } = useToast();

  // Q&A form state
  const [askName, setAskName] = useState("");
  const [askEmail, setAskEmail] = useState("");
  const [askQuestion, setAskQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || !askQuestion.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("product_questions").insert({
      product_id: selectedProduct.id,
      asker_name: askName.trim() || "Visitante",
      asker_email: askEmail.trim() || null,
      question: askQuestion.trim(),
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Erro ao enviar pergunta", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Pergunta enviada!", description: "Voce sera notificado quando responderem." });
    setAskName("");
    setAskEmail("");
    setAskQuestion("");
    reloadQuestions();
  }

  const filtered = useMemo(() => {
    let list = activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

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
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#131921] text-white">
        <div className="px-4 py-2 flex items-center gap-3">
          <button onClick={() => { setSearchQuery(""); setActiveCategory("Todos"); window.scrollTo(0, 0); }} className="shrink-0">
            <Logo size="sm" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 h-9 rounded-lg bg-white text-gray-900 border-none text-sm focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>
          <Link
            to="/rastreio"
            className="shrink-0 flex items-center gap-1.5 text-white text-xs hover:text-amber-300 transition-colors"
          >
            <Truck size={16} />
            <span className="hidden sm:inline">Rastrear</span>
          </Link>
          <Link
            to="/login"
            className="shrink-0 flex items-center gap-1.5 text-white text-xs hover:text-amber-300 transition-colors"
          >
            <LogIn size={16} />
            <span className="hidden sm:inline">Entrar</span>
          </Link>
        </div>

        {/* Category Nav with Icons */}
        <CategoryNav active={activeCategory} onSelect={setActiveCategory} variant="dark" />
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#232F3E] via-[#37475A] to-[#232F3E] text-white px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-bold">
              Compre dos EUA, receba no Brasil
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">
              Personal shopper em Miami com entrega segura
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
              <ShoppingCart size={14} className="text-amber-400" />
              <span>Escolha</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
              <Plane size={14} className="text-amber-400" />
              <span>Compramos</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-300">
              <Package size={14} className="text-amber-400" />
              <span>Entregamos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Results Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <p className="text-sm text-gray-700">
          {loading ? "Carregando..." : (
            <>
              <span className="font-bold text-[#C45500]">{filtered.length}</span>{" "}
              resultado{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "Todos" && (
                <> em <span className="font-semibold">{activeCategory}</span></>
              )}
            </>
          )}
        </p>
        <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {/* Deals Section */}
      {!dealsLoading && deals.length > 0 && (
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="px-4 max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={18} className="text-[#CC0C39]" />
              <h2 className="text-base font-bold text-gray-900">Ofertas do Dia</h2>
              <Badge className="bg-[#CC0C39] text-white text-[10px] hover:bg-[#CC0C39]">
                {deals.length} ofertas
              </Badge>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {deals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  convert={convert}
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pre-Sale Banner */}
      <div className="max-w-6xl mx-auto">
        <PreSaleBanner />
      </div>

      {/* Product Grid / Themed Sections */}
      <main className="px-3 py-3 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <p className="text-gray-500 text-sm">Nenhum produto encontrado.</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-sky-700 hover:underline mt-2"
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : activeCategory === "Todos" && !searchQuery.trim() ? (
          /* Themed sections when viewing all products without search */
          <ThemedProductSections
            products={products}
            deals={deals.map((d) => ({
              product_id: d.product_id,
              discount_percent: d.discount_percent,
              deal_type: d.deal_type,
              ends_at: d.ends_at,
            }))}
            convert={convert}
            onSelectProduct={setSelectedProduct}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const activeDeal = deals.find((d) => d.product_id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  brl={convert(product.price_usd)}
                  onClick={() => setSelectedProduct(product)}
                  activeDeal={activeDeal ? { discount_percent: activeDeal.discount_percent, deal_type: activeDeal.deal_type } : null}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Free Shipping Banner */}
      <div className="max-w-6xl mx-auto">
        <FreeShippingBanner />
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Footer */}
      <footer className="bg-[#232F3E] text-gray-300 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Logo size="sm" />
          </div>
          <p className="text-xs">
            Personal shopper em Miami. Produtos originais dos EUA com entrega segura no Brasil.
          </p>
          <a
            href="https://wa.me/5511999999999?text=Olá! Vim do site MalaBridge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            <MessageCircle size={16} />
            Falar pelo WhatsApp
          </a>
          <p className="text-[10px] text-gray-500 pt-2">
            MalaBridge &copy; {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-auto p-0 gap-0 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedProduct && (() => {
            const { rating, reviews } = getRating(selectedProduct);
            const brl = convert(selectedProduct.price_usd);
            const bestSeller = isBestSeller(selectedProduct.name);
            const prevPrice = fakePreviousPrice(brl, selectedProduct.name);

            return (
              <>
                <div className="bg-white relative">
                  <div className="aspect-square bg-white p-6 flex items-center justify-center">
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-3 right-3 bg-white/90 text-gray-600 rounded-full p-1.5 shadow-md hover:bg-white"
                  >
                    <X size={16} />
                  </button>
                  {bestSeller && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#E47911] text-white text-xs font-bold px-2 py-1 rounded">
                        Mais vendido
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3 bg-white">
                  <div>
                    <Badge variant="secondary" className="text-[10px] font-medium mb-2">
                      {selectedProduct.category}
                    </Badge>
                    <DialogHeader>
                      <DialogTitle className="text-base font-normal text-gray-900 leading-snug">
                        {selectedProduct.name}
                      </DialogTitle>
                      <DialogDescription className="sr-only">Detalhes do produto {selectedProduct.name}</DialogDescription>
                    </DialogHeader>
                    <p className="text-sm text-sky-700 mt-1">
                      Visitar loja de {selectedProduct.brand}
                    </p>
                  </div>

                  <StarRating rating={rating} reviews={reviews} />

                  {selectedProduct.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500 line-through">
                      R$ {prevPrice.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-gray-900">
                        R$ {brl.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      US$ {selectedProduct.price_usd.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2">
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
                      {productReviews.length > 0 && (
                        <Badge variant="secondary" className="text-[10px]">{productReviews.length}</Badge>
                      )}
                    </div>

                    {reviewsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    ) : productReviews.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-3">
                        Nenhuma avaliação ainda. Faça login para avaliar!
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

                  {/* Q&A Section */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle size={16} className="text-[#007185]" />
                      <h3 className="font-semibold text-sm text-gray-900">
                        Perguntas e Respostas
                      </h3>
                      {questions.length > 0 && (
                        <Badge variant="secondary" className="text-[10px]">{questions.length}</Badge>
                      )}
                    </div>

                    {/* Ask question form */}
                    <form onSubmit={handleAskQuestion} className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 space-y-2">
                      <p className="text-xs font-medium text-gray-700">Faca uma pergunta sobre este produto</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Seu nome"
                          value={askName}
                          onChange={(e) => setAskName(e.target.value)}
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007185]"
                        />
                        <input
                          type="email"
                          placeholder="Email (opcional)"
                          value={askEmail}
                          onChange={(e) => setAskEmail(e.target.value)}
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007185]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Escreva sua pergunta..."
                          value={askQuestion}
                          onChange={(e) => setAskQuestion(e.target.value)}
                          required
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#007185]"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          disabled={submitting || !askQuestion.trim()}
                          className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 px-3 h-auto py-1.5 border border-[#FCD200]"
                        >
                          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        </Button>
                      </div>
                    </form>

                    {/* Questions list */}
                    {questionsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    ) : questions.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-3">
                        Nenhuma pergunta ainda. Seja o primeiro a perguntar!
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {questions.map((q) => (
                          <div key={q.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                            {/* Question */}
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-[#007185]/10 text-[#007185] flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                <User size={10} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold text-gray-900">{q.asker_name}</span>
                                  <span className="text-[10px] text-gray-400">
                                    {new Date(q.created_at).toLocaleDateString("pt-BR")}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-800 mt-0.5">{q.question}</p>
                              </div>
                            </div>

                            {/* Answer */}
                            {q.answer ? (
                              <div className="flex items-start gap-2 ml-4 bg-green-50 rounded-lg p-2">
                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                  <CheckCircle2 size={10} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-green-700">Ju Imports</span>
                                    {q.answered_at && (
                                      <span className="text-[10px] text-gray-400">
                                        {new Date(q.answered_at).toLocaleDateString("pt-BR")}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-green-800 mt-0.5">{q.answer}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[10px] text-gray-400 ml-7 italic">
                                Aguardando resposta...
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Link
                      to="/login"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-full py-2.5 px-4 font-medium text-sm transition-colors border border-[#FCD200]"
                    >
                      <LogIn size={16} />
                      Login para comprar
                    </Link>
                    <button
                      onClick={() => shareProductWhatsApp(selectedProduct, brl)}
                      className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full py-2.5 px-4 font-medium text-sm transition-colors"
                    >
                      <Share2 size={16} />
                    </button>
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
