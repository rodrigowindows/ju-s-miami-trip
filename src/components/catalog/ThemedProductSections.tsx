import { useState, useEffect } from "react";
import { Zap, Droplets, Timer, Heart, Flame } from "lucide-react";
import { ProductCard, type ActiveDeal } from "./ProductCard";
import { isBestSeller } from "./catalog-utils";
import type { CatalogProduct } from "@/types";

/* ── Types ────────────────────────────── */
interface DealInfo {
  product_id: string;
  discount_percent: number;
  deal_type: string;
  ends_at: string;
}

interface ThemedProductSectionsProps {
  products: CatalogProduct[];
  deals: DealInfo[];
  convert: (usd: number) => number;
  onSelectProduct: (p: CatalogProduct) => void;
  onViewAll?: () => void;
}

/* ── Countdown hook ───────────────────── */
function useSectionCountdown(deals: DealInfo[]) {
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    // Use the latest ending deal for the section timer
    const latestEnd = deals.reduce((max, d) => {
      const t = new Date(d.ends_at).getTime();
      return t > max ? t : max;
    }, 0);

    if (!latestEnd) return;

    function tick() {
      const diff = latestEnd - Date.now();
      if (diff <= 0) {
        setTimeLeft("Encerrado");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      );
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deals]);

  return timeLeft;
}

/* ── Section Title: MAIS VENDIDOS style (centered with decorative lines) ── */
function DividerTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 mb-6">
      <div className="flex-1 h-px bg-[#ddd]" />
      <h2
        className="text-xl sm:text-2xl font-bold text-black text-center shrink-0 tracking-wide"
        style={{ fontFamily: "'Playfair Display', 'Gabarito', serif" }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px bg-[#ddd]" />
    </div>
  );
}

/* ── "Ver todos" link ───────────────── */
function ViewAllButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-black underline hover:text-gray-600 transition-colors"
      style={{ fontSize: 14 }}
    >
      Ver todos &rarr;
    </button>
  );
}

/* ── Product Grid (4 per row desktop, 2 mobile) ── */
function ProductGrid({
  products,
  convert,
  onSelect,
  deals,
  maxItems = 8,
}: {
  products: CatalogProduct[];
  convert: (usd: number) => number;
  onSelect: (p: CatalogProduct) => void;
  deals: DealInfo[];
  maxItems?: number;
}) {
  const visible = products.slice(0, maxItems);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {visible.map((product) => {
        const activeDeal = deals.find((d) => d.product_id === product.id);
        return (
          <ProductCard
            key={product.id}
            product={product}
            brl={convert(product.price_usd)}
            onClick={() => onSelect(product)}
            activeDeal={
              activeDeal
                ? { discount_percent: activeDeal.discount_percent, deal_type: activeDeal.deal_type }
                : null
            }
          />
        );
      })}
    </div>
  );
}

/* ── Keyword helpers ──────────────────── */
const SKINCARE_KEYWORDS = [
  "skincare", "skin", "hidratante", "serum", "moisturizer", "cleanser",
  "toner", "sunscreen", "protetor solar", "retinol", "vitamin c",
  "vitamina c", "hyaluronic", "ácido", "creme", "cream", "loção",
  "lotion", "mask", "máscara", "exfoliant", "esfoliante", "face",
  "facial", "eye cream", "beauty", "glow",
];

const PERFUME_KEYWORDS = [
  "perfume", "parfum", "eau de", "cologne", "fragrance", "fragrância",
  "body mist", "splash", "toilette", "edp", "edt",
];

function matchesKeywords(product: CatalogProduct, keywords: string[]): boolean {
  const text = `${product.name} ${product.description ?? ""} ${product.brand ?? ""}`.toLowerCase();
  return keywords.some((kw) => text.includes(kw));
}

/* ── Main Component ──────────────────── */
export function ThemedProductSections({
  products,
  deals,
  convert,
  onSelectProduct,
  onViewAll,
}: ThemedProductSectionsProps) {
  const countdown = useSectionCountdown(deals);

  // Build section product lists
  const bestSellers = products.filter((p) => isBestSeller(p.name));
  const vsProducts = products.filter((p) => {
    const b = (p.brand ?? "").toLowerCase();
    return b === "victoria's secret" || b === "victorias secret" || b === "victoria secret" || b === "vs" || b.includes("victoria");
  });
  const bbwProducts = products.filter(
    (p) => (p.brand ?? "").toLowerCase() === "bath & body works"
  );
  const dealProducts = deals
    .map((d) => products.find((p) => p.id === d.product_id))
    .filter(Boolean) as CatalogProduct[];
  const skincareProducts = products.filter((p) => matchesKeywords(p, SKINCARE_KEYWORDS));
  const perfumeProducts = products.filter((p) => matchesKeywords(p, PERFUME_KEYWORDS));

  // Fallbacks: if categories are too narrow, fill from Beauty/general
  const skincareFinal =
    skincareProducts.length >= 4
      ? skincareProducts
      : products.filter((p) => p.category === "Beauty").slice(0, 8);
  const perfumeFinal =
    perfumeProducts.length >= 4
      ? perfumeProducts
      : products.slice(0, 8);

  return (
    <div className="space-y-10 sm:space-y-[60px]">
      {/* ─── Section: VICTORIA'S SECRET (TOP) ─────────────────── */}
      {vsProducts.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(135deg, #FFD6E0 0%, #FFF0F5 50%, #FFFFFF 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart size={24} className="text-pink-500" fill="#ec4899" />
            <h2
              className="text-xl sm:text-2xl font-bold tracking-wider"
              style={{
                fontFamily: "'Playfair Display', 'Gabarito', serif",
                letterSpacing: "0.05em",
                color: "#BE185D",
              }}
            >
              VICTORIA'S SECRET
            </h2>
          </div>
          <p className="text-sm text-pink-700 mb-4" style={{ fontFamily: "'Gabarito', sans-serif" }}>
            Body mists, perfumes e kits direto de Miami
          </p>

          <div className="flex justify-end mb-4">
            <ViewAllButton onClick={onViewAll} />
          </div>

          <ProductGrid
            products={vsProducts}
            convert={convert}
            onSelect={onSelectProduct}
            deals={deals}
            maxItems={8}
          />
        </section>
      )}

      {/* ─── Section: MAIS VENDIDOS ─────────────────── */}
      {bestSellers.length > 0 && (
        <section>
          <DividerTitle>MAIS VENDIDOS</DividerTitle>
          <div className="flex justify-end mb-4">
            <ViewAllButton onClick={onViewAll} />
          </div>
          <ProductGrid
            products={bestSellers}
            convert={convert}
            onSelect={onSelectProduct}
            deals={deals}
            maxItems={8}
          />
        </section>
      )}

      {/* ─── Section: BATH & BODY WORKS ─────────────────── */}
      {bbwProducts.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(135deg, #E8F5E9 0%, #FFF8E1 50%, #FFFFFF 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Flame size={24} className="text-orange-500" />
            <h2
              className="text-xl sm:text-2xl font-bold tracking-wider"
              style={{
                fontFamily: "'Playfair Display', 'Gabarito', serif",
                letterSpacing: "0.05em",
                color: "#1B5E20",
              }}
            >
              BATH & BODY WORKS
            </h2>
          </div>
          <p className="text-sm text-green-800 mb-4" style={{ fontFamily: "'Gabarito', sans-serif" }}>
            Mists, velas e aromatizadores mais amados dos EUA
          </p>

          <div className="flex justify-end mb-4">
            <ViewAllButton onClick={onViewAll} />
          </div>

          <ProductGrid
            products={bbwProducts}
            convert={convert}
            onSelect={onSelectProduct}
            deals={deals}
            maxItems={8}
          />
        </section>
      )}

      {/* ─── Section 2: OFERTAS DO DIA ────────────────── */}
      {dealProducts.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{ backgroundColor: "#FFF8E1", borderRadius: 12 }}
        >
          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer size={18} className="text-red-600" />
            <span className="text-red-600 font-bold text-sm">
              Termina em: {countdown}
            </span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <Zap size={24} className="text-amber-600" />
            <h2
              className="text-xl sm:text-2xl font-bold text-black"
              style={{ fontFamily: "'Playfair Display', 'Gabarito', serif" }}
            >
              OFERTAS DO DIA
            </h2>
          </div>

          <div className="flex justify-end mb-4">
            <ViewAllButton onClick={onViewAll} />
          </div>

          <ProductGrid
            products={dealProducts}
            convert={convert}
            onSelect={onSelectProduct}
            deals={deals}
            maxItems={8}
          />
        </section>
      )}

      {/* ─── Section 3: SKINCARE FAVORITOS ────────────── */}
      {skincareFinal.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{ backgroundColor: "#FFF0F5", borderRadius: 12 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Droplets size={24} className="text-pink-500" />
            <h2
              className="text-xl sm:text-2xl font-bold text-black"
              style={{ fontFamily: "'Playfair Display', 'Gabarito', serif" }}
            >
              SKINCARE FAVORITOS
            </h2>
          </div>

          <div className="flex justify-end mb-4">
            <ViewAllButton onClick={onViewAll} />
          </div>

          <ProductGrid
            products={skincareFinal}
            convert={convert}
            onSelect={onSelectProduct}
            deals={deals}
            maxItems={8}
          />
        </section>
      )}

      {/* ─── Section 4: PERFUMES IMPORTADOS ───────────── */}
      {perfumeFinal.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #F5F0E8 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <h2
              className="text-xl sm:text-2xl font-bold text-black tracking-wider"
              style={{
                fontFamily: "'Playfair Display', 'Gabarito', serif",
                letterSpacing: "0.05em",
              }}
            >
              PERFUMES IMPORTADOS
            </h2>
          </div>

          <div className="flex justify-end mb-4">
            <ViewAllButton onClick={onViewAll} />
          </div>

          <ProductGrid
            products={perfumeFinal}
            convert={convert}
            onSelect={onSelectProduct}
            deals={deals}
            maxItems={8}
          />
        </section>
      )}
    </div>
  );
}
