import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Promotion, CatalogProduct } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Copy, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function useHomeData() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const [promosRes, productsRes] = await Promise.all([
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
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      setPromos((promosRes.data as Promotion[]) ?? []);
      setProducts((productsRes.data as CatalogProduct[]) ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { promos, products, loading };
}

function useExchangeRate() {
  const [rate, setRate] = useState(6.05);
  const [spread, setSpread] = useState(8);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["exchange_rate_usd_brl", "spread_percentage"]);
      if (data) {
        for (const row of data) {
          if (row.key === "exchange_rate_usd_brl") setRate(parseFloat(row.value));
          if (row.key === "spread_percentage") setSpread(parseFloat(row.value));
        }
      }
    }
    fetch();
  }, []);

  function convert(usd: number) {
    return usd * rate * (1 + spread / 100);
  }

  return { convert };
}

const Products = () => {
  const { promos, products, loading } = useHomeData();
  const { convert } = useExchangeRate();
  const { toast } = useToast();

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
                  className="group relative bg-white rounded-2xl border border-violet-100 p-5 hover:shadow-lg hover:border-violet-200 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                    {promo.discount_type === "percent"
                      ? `${promo.discount_value}% OFF`
                      : `R$ ${promo.discount_value.toFixed(0)} OFF`}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                      <Tag size={18} className="text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-bold text-foreground">
                        {promo.name}
                      </h3>
                      {promo.min_order_value && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Pedido min: R$ {promo.min_order_value.toFixed(0)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Expira em {new Date(promo.expires_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono text-sm px-3 py-1">
                      {promo.coupon_code}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs rounded-full border-violet-200 text-violet-700 hover:bg-violet-50"
                      onClick={() => copyCode(promo.coupon_code)}
                    >
                      <Copy size={12} />
                      Copiar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section id="produtos" className="py-24 bg-miami-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="font-body text-sm font-semibold tracking-widest uppercase text-miami-blue mb-2 block">
              Vitrine
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Produtos Populares
            </h2>
            <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto">
              Confira os itens mais procurados direto dos EUA
            </p>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              Em breve novos produtos!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card"
                >
                  <div className="aspect-square bg-muted/30 relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-foreground text-[10px] font-medium backdrop-blur-sm border-0">
                      {product.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                      {product.brand}
                    </p>
                    <CardTitle className="font-display text-lg leading-tight">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {product.description && (
                      <p className="font-body text-muted-foreground text-sm line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex items-end justify-between pt-0">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        US$ {product.price_usd.toFixed(2)}
                      </p>
                      <span className="font-display text-xl font-bold text-primary">
                        R$ {convert(product.price_usd).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="font-body rounded-full gap-2"
                      asChild
                    >
                      <a href="/login">
                        <ShoppingBag size={16} />
                        Comprar
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              variant="outline"
              className="rounded-full gap-2 px-6"
              asChild
            >
              <a href="/login">
                Ver todos os produtos
                <ArrowRight size={16} />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
