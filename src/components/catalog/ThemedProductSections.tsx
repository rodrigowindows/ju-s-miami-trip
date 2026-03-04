import { useState, useEffect } from "react";
import { Zap, Droplets, Timer, Heart, Flame, Smartphone, Baby, Shirt, Headphones, Pill, MessageCircle, ShoppingBag } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { ProductCard, type ActiveDeal } from "./ProductCard";
import { GroupedProductCard } from "./GroupedProductCard";
import { isBestSeller, groupSimilarProducts, isProductGroup } from "./catalog-utils";
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

/* ── Product image showcase in section header ── */
function ProductShowcase({ products, maxItems = 5 }: { products: CatalogProduct[]; maxItems?: number }) {
  const items = products.slice(0, maxItems);
  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {items.map((p) => (
        <div
          key={p.id}
          className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white shadow-sm border border-white/60"
        >
          <img
            src={p.image_url}
            alt={p.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
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
  const grouped = groupSimilarProducts(products);
  const visible = grouped.slice(0, maxItems);
  const dealMap = new Map(deals.map((d) => [d.product_id, { discount_percent: d.discount_percent, deal_type: d.deal_type }]));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {visible.map((item) => {
        if (isProductGroup(item)) {
          return (
            <GroupedProductCard
              key={item.groupName}
              group={item}
              convert={convert}
              onClick={onSelect}
              activeDealMap={dealMap}
            />
          );
        }
        const activeDeal = dealMap.get(item.id);
        return (
          <ProductCard
            key={item.id}
            product={item}
            brl={convert(item.price_usd)}
            onClick={() => onSelect(item)}
            activeDeal={activeDeal ? { discount_percent: activeDeal.discount_percent, deal_type: activeDeal.deal_type } : null}
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

const APPLE_ACCESSORY_KEYWORDS = [
  "airtag", "apple pencil", "magsafe", "magic keyboard", "airpods max",
  "apple watch", "case", "capa", "carregador", "charger", "cable", "cabo",
];

const KIDS_KEYWORDS = [
  "lego", "barbie", "hot wheels", "disney", "squishmallow", "play-doh",
  "nerf", "fisher-price", "brinquedo", "toy", "boneca", "carrinho",
  "baby alive", "playdoh",
];

const BABY_KEYWORDS = [
  "graco", "carter", "dr. brown", "munchkin", "chicco", "skip hop",
  "gerber", "bebe", "baby", "carrinho bebe", "cadeirinha", "mamadeira",
  "roupinha",
];

const SUPPLEMENT_KEYWORDS = [
  "vitamina", "vitamin", "suplemento", "supplement", "creatina", "creatine",
  "whey", "protein", "colágeno", "collagen", "melatonina", "melatonin",
  "biotina", "biotin", "glucosamina", "ashwagandha", "omega", "kirkland",
  "optimum nutrition", "centrum", "multivitamin",
];

const AUDIO_KEYWORDS = [
  "jbl", "bose", "beats", "headphone", "fone", "speaker", "caixa de som",
  "echo dot", "alexa", "sonos", "marshall", "airpods max", "quietcomfort",
  "gopro",
];

const FASHION_BRAND_KEYWORDS = [
  "ralph lauren", "tommy hilfiger", "calvin klein", "under armour",
  "gap", "champion", "lacoste", "polo", "cueca", "moletom", "hoodie",
  "abercrombie",
];

function matchesKeywords(product: CatalogProduct, keywords: string[]): boolean {
  const text = `${product.name} ${product.description ?? ""} ${product.brand ?? ""}`.toLowerCase();
  return keywords.some((kw) => text.includes(kw));
}

/* ── WhatsApp CTA Section ────────────── */
function WhatsAppCTA() {
  const { data: settings } = useSettings();
  const number = settings?.whatsapp_number ?? "5561999999999";
  const message = encodeURIComponent(
    "Olá! Não encontrei o produto que procuro no catálogo. Pode me ajudar? 🛍️"
  );
  const url = `https://wa.me/${number}?text=${message}`;

  return (
    <section
      className="rounded-xl px-5 py-8 sm:px-10 sm:py-10 text-center"
      style={{
        background: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 40%, #FFFFFF 100%)",
        borderRadius: 12,
      }}
    >
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={28} className="text-[#25D366]" />
        </div>
        <h2
          className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'Playfair Display', 'Gabarito', serif" }}
        >
          Não achou o que procura?
        </h2>
        <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "'Gabarito', sans-serif" }}>
          Compramos qualquer produto pra você direto dos EUA!
        </p>
        <p className="text-xs text-gray-500 mb-6" style={{ fontFamily: "'Gabarito', sans-serif" }}>
          Amazon, Walmart, Target, Apple Store e mais — manda o link!
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: "#25D366", fontFamily: "'Gabarito', sans-serif" }}
        >
          <MessageCircle size={20} fill="white" stroke="white" />
          Manda no WhatsApp
        </a>
        <p className="text-[11px] text-gray-400 mt-4">
          Resposta rápida · Cotação sem compromisso
        </p>
      </div>
    </section>
  );
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
  const appleAccessories = products.filter(
    (p) =>
      (p.brand ?? "").toLowerCase() === "apple" &&
      matchesKeywords(p, APPLE_ACCESSORY_KEYWORDS)
  );
  const kidsProducts = products.filter(
    (p) => p.category === "Kids" || matchesKeywords(p, KIDS_KEYWORDS)
  );
  const babyProducts = products.filter(
    (p) => matchesKeywords(p, BABY_KEYWORDS)
  );
  const supplementProducts = products.filter(
    (p) => p.category === "Health" || matchesKeywords(p, SUPPLEMENT_KEYWORDS)
  );
  const audioProducts = products.filter(
    (p) => matchesKeywords(p, AUDIO_KEYWORDS)
  );
  const fashionBrandProducts = products.filter(
    (p) => matchesKeywords(p, FASHION_BRAND_KEYWORDS)
  );

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
          <p className="text-sm text-pink-700 mb-3" style={{ fontFamily: "'Gabarito', sans-serif" }}>
            Body mists, perfumes e kits direto de Miami
          </p>

          <ProductShowcase products={vsProducts} maxItems={5} />

          <div className="flex justify-end mb-4 mt-4">
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
          <p className="text-sm text-green-800 mb-3" style={{ fontFamily: "'Gabarito', sans-serif" }}>
            Mists, velas e aromatizadores mais amados dos EUA
          </p>

          <ProductShowcase products={bbwProducts} maxItems={5} />

          <div className="flex justify-end mb-4 mt-4">
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
          <div className="flex items-center gap-3 mb-3">
            <Droplets size={24} className="text-pink-500" />
            <h2
              className="text-xl sm:text-2xl font-bold text-black"
              style={{ fontFamily: "'Playfair Display', 'Gabarito', serif" }}
            >
              SKINCARE FAVORITOS
            </h2>
          </div>

          <ProductShowcase products={skincareFinal} maxItems={5} />

          <div className="flex justify-end mb-4 mt-4">
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

      {/* ─── Section: APPLE ACESSÓRIOS ───────────── */}
      {appleAccessories.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(135deg, #F5F5F7 0%, #E8E8ED 50%, #FFFFFF 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Smartphone size={24} className="text-gray-700" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', 'Gabarito', serif", letterSpacing: "0.05em", color: "#1D1D1F" }}>
              APPLE ACESSÓRIOS
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-3" style={{ fontFamily: "'Gabarito', sans-serif" }}>AirTags, cases, carregadores e mais do ecossistema Apple</p>
          <ProductShowcase products={appleAccessories} maxItems={5} />
          <div className="flex justify-end mb-4 mt-4"><ViewAllButton onClick={onViewAll} /></div>
          <ProductGrid products={appleAccessories} convert={convert} onSelect={onSelectProduct} deals={deals} maxItems={8} />
        </section>
      )}

      {/* ─── Section: KIDS & BRINQUEDOS ───────────── */}
      {kidsProducts.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(135deg, #FFF3E0 0%, #E3F2FD 50%, #FFFFFF 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Baby size={24} className="text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', 'Gabarito', serif", letterSpacing: "0.05em", color: "#E65100" }}>
              KIDS & BRINQUEDOS
            </h2>
          </div>
          <p className="text-sm text-orange-700 mb-3" style={{ fontFamily: "'Gabarito', sans-serif" }}>LEGO, Barbie, Nerf e muito mais para a criançada</p>
          <ProductShowcase products={kidsProducts} maxItems={5} />
          <div className="flex justify-end mb-4 mt-4"><ViewAllButton onClick={onViewAll} /></div>
          <ProductGrid products={kidsProducts} convert={convert} onSelect={onSelectProduct} deals={deals} maxItems={8} />
        </section>
      )}

      {/* ─── Section: BABY & BEBÊ ───────────── */}
      {babyProducts.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(135deg, #FCE4EC 0%, #FFF8E1 50%, #FFFFFF 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Heart size={24} className="text-pink-400" fill="#f9a8d4" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', 'Gabarito', serif", letterSpacing: "0.05em", color: "#AD1457" }}>
              BABY & BEBÊ
            </h2>
          </div>
          <p className="text-sm text-pink-700 mb-3" style={{ fontFamily: "'Gabarito', sans-serif" }}>Carrinhos, mamadeiras e roupinhas importadas</p>
          <ProductShowcase products={babyProducts} maxItems={5} />
          <div className="flex justify-end mb-4 mt-4"><ViewAllButton onClick={onViewAll} /></div>
          <ProductGrid products={babyProducts} convert={convert} onSelect={onSelectProduct} deals={deals} maxItems={8} />
        </section>
      )}

      {/* ─── Section: ROUPAS DE MARCA ───────────── */}
      {fashionBrandProducts.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(135deg, #EFEBE9 0%, #FFF8E1 50%, #FFFFFF 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Shirt size={24} className="text-amber-800" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', 'Gabarito', serif", letterSpacing: "0.05em", color: "#4E342E" }}>
              ROUPAS DE MARCA
            </h2>
          </div>
          <p className="text-sm text-amber-900 mb-3" style={{ fontFamily: "'Gabarito', sans-serif" }}>Ralph Lauren, Tommy, CK, TNF e mais com preço de outlet</p>
          <ProductShowcase products={fashionBrandProducts} maxItems={5} />
          <div className="flex justify-end mb-4 mt-4"><ViewAllButton onClick={onViewAll} /></div>
          <ProductGrid products={fashionBrandProducts} convert={convert} onSelect={onSelectProduct} deals={deals} maxItems={8} />
        </section>
      )}

      {/* ─── Section: SUPLEMENTOS & VITAMINAS ───────────── */}
      {supplementProducts.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #FFFFFF 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Pill size={24} className="text-green-600" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', 'Gabarito', serif", letterSpacing: "0.05em", color: "#2E7D32" }}>
              SUPLEMENTOS & VITAMINAS
            </h2>
          </div>
          <p className="text-sm text-green-800 mb-3" style={{ fontFamily: "'Gabarito', sans-serif" }}>Kirkland, Optimum Nutrition, Vital Proteins direto dos EUA</p>
          <ProductShowcase products={supplementProducts} maxItems={5} />
          <div className="flex justify-end mb-4 mt-4"><ViewAllButton onClick={onViewAll} /></div>
          <ProductGrid products={supplementProducts} convert={convert} onSelect={onSelectProduct} deals={deals} maxItems={8} />
        </section>
      )}

      {/* ─── Section: ÁUDIO & ELETRÔNICOS ───────────── */}
      {audioProducts.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(135deg, #263238 0%, #37474F 50%, #455A64 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Headphones size={24} className="text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider" style={{ fontFamily: "'Playfair Display', 'Gabarito', serif", letterSpacing: "0.05em", color: "#E0F7FA" }}>
              ÁUDIO & ELETRÔNICOS
            </h2>
          </div>
          <p className="text-sm text-cyan-200 mb-3" style={{ fontFamily: "'Gabarito', sans-serif" }}>JBL, Bose, Beats, GoPro — som e tech premium</p>
          <ProductShowcase products={audioProducts} maxItems={5} />
          <div className="flex justify-end mb-4 mt-4"><ViewAllButton onClick={onViewAll} /></div>
          <ProductGrid products={audioProducts} convert={convert} onSelect={onSelectProduct} deals={deals} maxItems={8} />
        </section>
      )}

      {/* ─── Section: PERFUMES IMPORTADOS ───────────── */}
      {perfumeFinal.length > 0 && (
        <section
          className="rounded-xl px-4 py-6 sm:px-10 sm:py-10"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #F5F0E8 100%)",
            borderRadius: 12,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-black tracking-wider" style={{ fontFamily: "'Playfair Display', 'Gabarito', serif", letterSpacing: "0.05em" }}>
              PERFUMES IMPORTADOS
            </h2>
          </div>
          <ProductShowcase products={perfumeFinal} maxItems={5} />
          <div className="flex justify-end mb-4 mt-4"><ViewAllButton onClick={onViewAll} /></div>
          <ProductGrid products={perfumeFinal} convert={convert} onSelect={onSelectProduct} deals={deals} maxItems={8} />
        </section>
      )}

      {/* ─── Section: NÃO ACHOU? WHATSAPP CTA ───────────── */}
      <WhatsAppCTA />
    </div>
  );
}
