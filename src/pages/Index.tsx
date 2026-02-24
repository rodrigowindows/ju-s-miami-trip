import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import type { CatalogProduct } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  LogIn,
  Search,
  Truck,
  ChevronDown,
  SlidersHorizontal,
  ShoppingBag,
  Zap,
  Clock,
  Shield,
  Tag,
  MessageCircle,
} from "lucide-react";
import Logo from "@/components/shared/Logo";
import ProductCard from "@/components/shared/ProductCard";
import ProductDetailModal from "@/components/shared/ProductDetailModal";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useSettings } from "@/hooks/useSettings";
import { useActivePromotions } from "@/hooks/usePromotions";
import { calculatePriceBRL } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { value: "Todos", label: "Todos" },
  { value: "Tech", label: "Tecnologia" },
  { value: "Beauty", label: "Beleza & Cosméticos" },
  { value: "Fashion", label: "Moda & Acessórios" },
] as const;

const SORT_OPTIONS = [
  { value: "relevance", label: "Mais Relevantes" },
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
  { value: "name", label: "Nome A-Z" },
] as const;

const Index = () => {
  const { data: products = [], isLoading } = useCatalogProducts();
  const { data: settings } = useSettings();
  const { data: promos = [] } = useActivePromotions();
  const { toast } = useToast();

  const rate = parseFloat(settings?.exchange_rate ?? "5.70");
  const spread = parseFloat(settings?.spread_percent ?? "3");
  const whatsapp = settings?.whatsapp_number ?? "5561999999999";

  const convert = useCallback(
    (usd: number) => calculatePriceBRL(usd, rate, spread),
    [rate, spread],
  );

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
          p.description?.toLowerCase().includes(q),
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

  const copyCode = useCallback(
    (code: string) => {
      navigator.clipboard.writeText(code);
      toast({ title: "Cupom copiado!", description: code });
    },
    [toast],
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        {/* Promo ticker */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 text-white text-center py-1.5 px-4">
          <p className="text-[11px] font-medium tracking-wide">
            Compre dos EUA e receba no Brasil - Frete via viagem Miami
          </p>
        </div>

        {/* Search bar */}
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
            <span>Entrar</span>
          </Link>
        </div>

        {/* Category pills */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* ─── Trust Banner ─── */}
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
        {/* ─── Promo Coupons ─── */}
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

        {/* ─── Results bar + Sort ─── */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {isLoading ? (
              "Carregando..."
            ) : (
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
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSort(false);
                      }}
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

        {/* ─── Product Grid ─── */}
        <div className="px-3 pb-20">
          {isLoading ? (
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
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priceBRL={convert(product.price_usd)}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── How It Works (compact) ─── */}
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

        {/* ─── WhatsApp CTA ─── */}
        <div className="bg-white border-t border-gray-100 px-4 py-6 text-center">
          <p className="text-xs text-gray-500 mb-3">Duvidas? Fale com a gente</p>
          <a
            href={`https://wa.me/${whatsapp}?text=Ola! Vim do site MalaBridge`}
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

      {/* ─── Product Detail Modal ─── */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        convert={convert}
      />
    </div>
  );
};

export default Index;
