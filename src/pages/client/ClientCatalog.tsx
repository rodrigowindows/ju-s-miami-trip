import { useState, useMemo } from "react";
import { ShoppingBag, Search, Star, Truck, ChevronDown, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmptyState from "@/components/shared/EmptyState";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useCreateOrder, useCreateOrderItem } from "@/hooks/useOrders";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import type { CatalogProduct } from "@/types";
import { toast } from "sonner";
import { calculatePriceBRL } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";

const CATEGORIES = ["Todos", "Tech", "Beauty", "Fashion", "Lifestyle"];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevância" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "name", label: "A-Z" },
] as const;

function fakeRating(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  const rating = 3.5 + (Math.abs(hash) % 15) / 10;
  const reviews = 50 + (Math.abs(hash) % 950);
  return { rating: Math.min(rating, 5), reviews };
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
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
      <span className="text-xs text-sky-700">{reviews.toLocaleString("pt-BR")}</span>
    </div>
  );
}

function isBestSeller(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return Math.abs(hash) % 4 === 0;
}

export default function ClientCatalog() {
  const [category, setCategory] = useState("Todos");
  const { data: products, isLoading } = useCatalogProducts(category);
  const { data: settings } = useSettings();
  const { user, profile } = useAuth();
  const createOrder = useCreateOrder();
  const createOrderItem = useCreateOrderItem();

  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const [ordering, setOrdering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [showSort, setShowSort] = useState(false);

  const exchangeRate = Number(settings?.exchange_rate ?? "5.70");
  const spread = Number(settings?.spread_percent ?? "3");

  const calcBRL = (usd: number) => calculatePriceBRL(usd, exchangeRate, spread);

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
      {/* Search Bar */}
      <div className="bg-[#232F3E] px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 h-9 rounded-lg bg-white text-gray-900 border-none text-sm focus-visible:ring-2 focus-visible:ring-amber-400"
          />
        </div>
      </div>

      {/* Category Nav */}
      <div className="bg-[#131921] px-4 py-2 flex gap-3 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 text-sm font-medium transition-colors whitespace-nowrap pb-0.5 ${
              category === c
                ? "text-white border-b-2 border-amber-400"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

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
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5"
          >
            <SlidersHorizontal size={14} />
            Ordenar
            <ChevronDown size={14} />
          </button>
          {showSort && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      sortBy === opt.value ? "font-semibold text-[#C45500]" : "text-gray-700"
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
                  onClick={() => setSearchQuery("")}
                  className="text-sm text-sky-700 hover:underline"
                >
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((p) => {
              const { rating, reviews } = fakeRating(p.name);
              const bestSeller = isBestSeller(p.name);
              const brl = calcBRL(p.price_usd);
              const fakePreviousPrice = brl * (1 + (Math.abs(p.name.charCodeAt(0)) % 30 + 10) / 100);

              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="bg-white rounded-lg overflow-hidden text-left hover:shadow-lg transition-shadow group flex flex-col border border-gray-200"
                >
                  {bestSeller && (
                    <div className="bg-[#E47911] text-white text-[10px] font-bold px-2 py-0.5">
                      Mais vendido
                    </div>
                  )}

                  <div className="aspect-square bg-white p-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-3 pt-1 flex flex-col gap-1 flex-1 border-t border-gray-100">
                    <p className="text-sm text-gray-900 leading-tight line-clamp-2 group-hover:text-[#C45500] transition-colors">
                      {p.name}
                    </p>

                    <p className="text-[11px] text-gray-500">{p.brand}</p>

                    <StarRating rating={rating} reviews={reviews} />

                    <div className="mt-auto pt-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-900">R$</span>
                        <span className="text-xl font-bold text-gray-900">
                          {Math.floor(brl).toLocaleString("pt-BR")}
                        </span>
                        <span className="text-xs text-gray-900">
                          {(brl % 1).toFixed(2).slice(1).replace(".", ",")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-through">
                        R$ {fakePreviousPrice.toFixed(2).replace(".", ",")}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        US$ {p.price_usd.toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <Truck size={12} className="text-[#007600]" />
                      <span className="text-[11px] text-[#007600] font-medium">Entrega via viagem</span>
                    </div>
                  </div>
                </button>
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
            const fakePreviousPrice = brl * (1 + (Math.abs(selected.name.charCodeAt(0)) % 30 + 10) / 100);

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
                      R$ {fakePreviousPrice.toFixed(2).replace(".", ",")}
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
