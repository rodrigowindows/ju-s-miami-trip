import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { CatalogProduct } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  X,
  LogIn,
  Search,
  Star,
  Truck,
  ChevronDown,
  SlidersHorizontal,
  ShoppingBag,
  Zap,
  Clock,
  Shield,
  ChevronRight,
  Flame,
  Tag,
  MessageCircle,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import { calculatePriceBRL } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { key: "Todos" },
  { key: "Tech" },
  { key: "Beauty" },
  { key: "Fashion" },
] as const;

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "price_asc", label: "Menor preco" },
  { value: "price_desc", label: "Maior preco" },
  { value: "name", label: "A-Z" },
] as const;

type PromoData = {
  id: string;
  name: string;
  coupon_code: string;
  discount_type: string;
  discount_value: number;
  expires_at: string;
};

function useHomeData() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [promos, setPromos] = useState<PromoData[]>([]);
  const [rate, setRate] = useState(5.70);
  const [spread, setSpread] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [productsRes, promosRes, settingsRes] = await Promise.all([
        supabase
          .from("catalog_products")
          .select("*")
          .eq("active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("promotions")
          .select("id, name, coupon_code, discount_type, discount_value, expires_at")
          .eq("active", true)
          .gte("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("settings")
          .select("key, value")
          .in("key", ["exchange_rate", "spread_percent"]),
      ]);

      setProducts((productsRes.data as CatalogProduct[]) ?? []);
      setPromos((promosRes.data as PromoData[]) ?? []);

      if (settingsRes.data) {
        for (const row of settingsRes.data) {
          if (row.key === "exchange_rate") setRate(parseFloat(row.value));
          if (row.key === "spread_percent") setSpread(parseFloat(row.value));
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const convert = (usd: number) => calculatePriceBRL(usd, rate, spread);

  return { products, promos, convert, loading };
}

function stableHash(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={10}
            className={
              i < full
                ? "fill-amber-400 text-amber-400"
                : i === full && half
                ? "fill-amber-400/50 text-amber-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
      <span className="text-[10px] text-gray-500">{count.toLocaleString("pt-BR")}</span>
    </div>
  );
}

const Index = () => {
  const { products, promos, convert, loading } = useHomeData();
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [showSort, setShowSort] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);

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

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast({ title: "Cupom copiado!", description: code });
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        {/* Promo ticker */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 text-white text-center py-1.5 px-4">
          <p className="text-[11px] font-medium tracking-wide">
            Compre dos EUA e receba no Brasil - Frete via viagem Miami
          </p>
        </div>

        {/* Main header */}
        <div className="px-4 py-2 flex items-center gap-3">
          <Link to="/" className="shrink-0">
            <Logo size="sm" />
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 h-9 rounded-full bg-gray-100 border-none text-sm focus-visible:ring-2 focus-visible:ring-rose-300"
            />
          </div>
          <Link
            to="/login"
            className="shrink-0 flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium px-3 py-2 rounded-full transition-colors"
          >
            <LogIn size={14} />
            <span className="hidden sm:inline">Entrar</span>
          </Link>
        </div>

        {/* Category pills */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.key
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.key}
            </button>
          ))}
        </div>
      </header>

      {/* Trust banner */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5">
        <div className="flex items-center justify-around text-center max-w-lg mx-auto">
          <div className="flex items-center gap-1.5">
            <Truck size={14} className="text-rose-500" />
            <span className="text-[10px] text-gray-600 font-medium">Entrega segura</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Shield size={14} className="text-rose-500" />
            <span className="text-[10px] text-gray-600 font-medium">Compra garantida</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-rose-500" />
            <span className="text-[10px] text-gray-600 font-medium">Precos dos EUA</span>
          </div>
        </div>
      </div>

      <main>
        {/* Flash promo banners */}
        {promos.length > 0 && (
          <div className="px-3 pt-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {promos.map((promo) => (
                <button
                  key={promo.id}
                  onClick={() => copyCode(promo.coupon_code)}
                  className="shrink-0 bg-gradient-to-r from-rose-500 to-violet-500 rounded-xl p-3 text-white min-w-[200px] text-left hover:opacity-90 transition-opacity"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Tag size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cupom</span>
                  </div>
                  <p className="text-sm font-bold">{promo.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="bg-white/20 text-white text-xs font-mono px-2 py-0.5 rounded">
                      {promo.coupon_code}
                    </span>
                    <span className="text-xs font-bold">
                      {promo.discount_type === "percent"
                        ? `${promo.discount_value}% OFF`
                        : `R$${promo.discount_value} OFF`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results bar + sort */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {loading ? "Carregando..." : (
              <>
                <span className="font-bold text-gray-900">{filtered.length}</span>{" "}
                produto{filtered.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-300"
            >
              <SlidersHorizontal size={12} />
              Ordenar
              <ChevronDown size={12} />
            </button>
            {showSort && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 min-w-[160px]">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        sortBy === opt.value ? "font-semibold text-rose-500" : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Grid - Shein style */}
        <div className="px-3 pb-20">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <Search size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Nenhum produto encontrado</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-sm text-rose-500 hover:underline mt-2"
                >
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {filtered.map((product) => {
                const h = stableHash(product.name);
                const rating = 3.5 + (h % 15) / 10;
                const reviews = 50 + (h % 950);
                const bestSeller = h % 4 === 0;
                const brl = convert(product.price_usd);
                const discount = 10 + (h % 30);
                const originalPrice = brl / (1 - discount / 100);

                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white rounded-xl overflow-hidden text-left hover:shadow-md transition-all group flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          -{discount}%
                        </span>
                      </div>
                      {bestSeller && (
                        <div className="absolute top-1.5 right-1.5">
                          <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Flame size={8} />
                            HOT
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-2.5 flex flex-col gap-1 flex-1">
                      <p className="text-xs text-gray-800 leading-tight line-clamp-2">
                        {product.name}
                      </p>

                      <div className="mt-auto pt-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-gray-900">
                            R${Math.floor(brl).toLocaleString("pt-BR")}
                            <span className="text-xs">,{(brl % 1).toFixed(2).slice(2)}</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 line-through">
                          R$ {originalPrice.toFixed(2).replace(".", ",")}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          US$ {product.price_usd.toFixed(2)}
                        </p>
                      </div>

                      <StarRating rating={Math.min(rating, 5)} count={reviews} />

                      <div className="flex items-center gap-1 mt-0.5">
                        <Truck size={10} className="text-green-600" />
                        <span className="text-[9px] text-green-600 font-medium">Frete viagem</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* How it works - compact */}
        <div className="bg-white border-t border-gray-100 px-4 py-8">
          <h2 className="text-center text-sm font-bold text-gray-900 mb-5">Como funciona</h2>
          <div className="flex items-start gap-4 max-w-sm mx-auto">
            {[
              { icon: ShoppingBag, text: "Escolha o produto" },
              { icon: Clock, text: "Compramos nos EUA" },
              { icon: Truck, text: "Receba no Brasil" },
            ].map((s, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-rose-50 flex items-center justify-center mb-2">
                  <s.icon size={18} className="text-rose-500" />
                </div>
                <p className="text-[10px] font-medium text-gray-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-white border-t border-gray-100 px-4 py-6 text-center">
          <p className="text-xs text-gray-500 mb-3">Duvidas? Fale com a gente</p>
          <a
            href="https://wa.me/5511999999999?text=Ola! Vim do site MalaBridge"
            target="_blank"
            rel="noreferrer"
          >
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full gap-2 px-6">
              <MessageCircle size={16} />
              WhatsApp
            </Button>
          </a>
        </div>
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-md mx-auto p-0 gap-0 rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedProduct && (() => {
            const h = stableHash(selectedProduct.name);
            const rating = Math.min(3.5 + (h % 15) / 10, 5);
            const reviews = 50 + (h % 950);
            const bestSeller = h % 4 === 0;
            const brl = convert(selectedProduct.price_usd);
            const discount = 10 + (h % 30);
            const originalPrice = brl / (1 - discount / 100);

            return (
              <>
                <div className="bg-white relative">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
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
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{discount}%
                    </span>
                    {bestSeller && (
                      <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                        <Flame size={10} />
                        HOT
                      </span>
                    )}
                  </div>
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
                    <p className="text-sm text-rose-500 mt-1 font-medium">
                      {selectedProduct.brand}
                    </p>
                  </div>

                  <StarRating rating={rating} count={reviews} />

                  {selectedProduct.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  )}

                  <div className="bg-rose-50 rounded-xl p-4 space-y-1">
                    <p className="text-xs text-gray-400 line-through">
                      R$ {originalPrice.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        R$ {brl.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                        -{discount}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      US$ {selectedProduct.price_usd.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-rose-100">
                      <Truck size={14} className="text-green-600" />
                      <span className="text-xs text-green-600 font-medium">Entrega via viagem Miami</span>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full py-3 px-4 font-medium text-sm transition-colors"
                  >
                    <ShoppingBag size={16} />
                    Fazer login para comprar
                  </Link>

                  <Link
                    to="/catalog"
                    className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-rose-500 transition-colors pt-1"
                  >
                    Ver catalogo completo
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
