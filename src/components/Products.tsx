import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { PromotionWithProduct, CatalogProduct } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Tag, Copy, ArrowRight, Star, TrendingUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { calculatePriceBRL } from "@/lib/calculations";
import { formatBRL } from "@/lib/format";

const HIGHLIGHT_NAMES = [
  "AirPods Pro 2",
  "Rare Beauty Soft Pinch Blush",
  "Nike Dunk Low Panda",
  "Stanley Quencher H2.0 40oz",
  "iPhone 16 Pro Case MagSafe",
  "Dyson Airwrap Complete",
  "Ray-Ban Aviator Classic",
  "Kindle Paperwhite 11a Geracao",
  "Dior Addict Lip Glow",
  "Adidas Samba OG",
  "Creatina Monohidratada 300g",
  "Charlotte Tilbury Pillow Talk Set",
];

function useHomeData() {
  const [promos, setPromos] = useState<PromotionWithProduct[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [rate, setRate] = useState(5.70);
  const [spread, setSpread] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [promosRes, productsRes, settingsRes] = await Promise.all([
        supabase
          .from("promotions")
          .select("*")
          .eq("active", true)
          .gte("expires_at", new Date().toISOString())
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("catalog_products")
          .select("*")
          .eq("active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("settings")
          .select("key, value")
          .in("key", ["exchange_rate", "spread_percent"]),
      ]);

      setPromos((promosRes.data as PromotionWithProduct[]) ?? []);
      setProducts((productsRes.data as CatalogProduct[]) ?? []);

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

  return { promos, products, rate, spread, loading };
}

const Products = () => {
  const { promos, products, rate, spread, loading } = useHomeData();
  const { toast } = useToast();

  const calcBRL = (usd: number) => calculatePriceBRL(usd, rate, spread);

  const highlighted = useMemo(() => {
    if (!products.length) return [];
    const picks = products.filter((p) => HIGHLIGHT_NAMES.includes(p.name));
    if (picks.length >= 6) return picks;
    const remaining = products.filter((p) => !HIGHLIGHT_NAMES.includes(p.name));
    return [...picks, ...remaining].slice(0, 12);
  }, [products]);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast({ title: "Cupom copiado!", description: code });
  }

  if (loading) {
    return (
      <section id="produtos" className="py-24 bg-miami-sand">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Promotions Section */}
      {promos.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-violet-50 via-white to-pink-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="font-body text-sm font-semibold tracking-widest uppercase text-violet-600 mb-2 block">
                Ofertas Especiais
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Cupons Ativos
              </h2>
              <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
                Aproveite nossos descontos exclusivos em compras dos EUA
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {promos.map((promo) => (
                <div
                  key={promo.id}
                  className="group relative bg-white rounded-2xl border border-violet-100 overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all duration-300"
                >
                  <div className="flex">
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-display text-sm font-bold text-foreground">
                            {promo.name}
                          </h3>
                        </div>
                        <Badge className="bg-primary text-primary-foreground text-[10px] font-bold shrink-0 border-0">
                          {promo.discount_type === "percent"
                            ? `${promo.discount_value}% OFF`
                            : `R$ ${promo.discount_value.toFixed(0)} OFF`}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-muted-foreground mt-1">
                        Expira em {new Date(promo.expires_at).toLocaleDateString("pt-BR")}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5">
                          {promo.coupon_code}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-[11px] h-7 rounded-full border-violet-200 text-violet-700 hover:bg-violet-50"
                          onClick={() => copyCode(promo.coupon_code)}
                        >
                          <Copy size={11} />
                          Copiar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Carousel */}
      <section id="produtos" className="py-20 bg-miami-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-miami-orange/10 text-miami-orange px-4 py-1.5 rounded-full mb-4">
              <TrendingUp size={14} />
              <span className="font-body text-xs font-semibold tracking-wider uppercase">
                Mais Pedidos
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Destaques de Miami
            </h2>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              Produtos com melhor custo-beneficio, faceis de trazer e que nossos clientes mais amam
            </p>
          </div>

          {highlighted.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              Em breve novos produtos!
            </p>
          ) : (
            <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-14">
              <Carousel
                opts={{ align: "start", loop: true }}
                plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
              >
                <CarouselContent className="-ml-3">
                  {highlighted.map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="pl-3 basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <div className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        <div className="relative h-40 md:h-48 overflow-hidden bg-muted">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <Badge
                            variant="secondary"
                            className="absolute top-2 left-2 text-[10px] font-semibold backdrop-blur-sm bg-background/80"
                          >
                            {product.category}
                          </Badge>
                          {product.price_usd <= 50 && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Star size={10} fill="currentColor" />
                              Facil trazer
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col flex-1 p-3 md:p-4">
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                          <h3 className="font-semibold text-sm leading-tight mt-0.5 line-clamp-2 flex-1">
                            {product.name}
                          </h3>
                          <div className="mt-2 space-y-0.5">
                            <p className="text-lg font-bold text-primary">
                              {formatBRL(calcBRL(product.price_usd))}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ou 3x de {formatBRL(calcBRL(product.price_usd) / 3)} sem juros
                            </p>
                            <p className="text-xs text-muted-foreground">
                              US$ {product.price_usd.toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-5 md:-left-7" />
                <CarouselNext className="-right-5 md:-right-7" />
              </Carousel>
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              size="lg"
              className="font-body rounded-full gap-2 px-8 shadow-lg shadow-primary/25"
              asChild
            >
              <Link to="/catalog">
                Ver catalogo completo
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
