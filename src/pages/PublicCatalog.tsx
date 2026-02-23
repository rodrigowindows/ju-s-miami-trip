import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { CatalogProduct, ProductQuestion } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2, X, LogIn, Search, Truck,
  HelpCircle, Send, User, CheckCircle2,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SortDropdown } from "@/components/catalog/SortDropdown";
import { StarRating } from "@/components/catalog/StarRating";
import { fakeRating, isBestSeller, fakePreviousPrice, CATEGORIES } from "@/components/catalog/catalog-utils";

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

export default function PublicCatalog() {
  const { products, loading } = useCatalog();
  const { convert } = useExchangeRate();

  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("relevance");

  const { questions, loading: questionsLoading, reload: reloadQuestions } = useQuestions(selectedProduct?.id ?? null);
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
          <Link to="/" className="shrink-0">
            <Logo size="sm" />
          </Link>
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
            to="/login"
            className="shrink-0 flex items-center gap-1.5 text-white text-xs hover:text-amber-300 transition-colors"
          >
            <LogIn size={16} />
            <span className="hidden sm:inline">Entrar</span>
          </Link>
        </div>

        {/* Category Nav */}
        <div className="bg-[#232F3E] px-4 py-1.5 flex gap-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 text-sm font-medium transition-colors whitespace-nowrap pb-0.5 ${
                activeCategory === cat
                  ? "text-white border-b-2 border-amber-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

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

      {/* Product Grid */}
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                brl={convert(product.price_usd)}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-md mx-auto p-0 gap-0 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedProduct && (() => {
            const { rating, reviews } = fakeRating(selectedProduct.name);
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

                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 rounded-full py-2.5 px-4 font-medium text-sm mt-2 transition-colors border border-[#FCD200]"
                  >
                    <LogIn size={16} />
                    Fazer login para comprar
                  </Link>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
