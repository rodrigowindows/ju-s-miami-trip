import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
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
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useSettings } from "@/hooks/useSettings";

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

const Products = () => {
  const { data: products, isLoading } = useCatalogProducts();
  const { data: settings } = useSettings();

  const exchangeRate = Number(settings?.exchange_rate ?? "5.70");
  const spread = Number(settings?.spread_percent ?? "3");
  const calcBRL = (usd: number) => usd * exchangeRate * (1 + spread / 100);

  const highlighted = useMemo(() => {
    if (!products?.length) return [];
    const picks = products.filter((p) => HIGHLIGHT_NAMES.includes(p.name));
    if (picks.length >= 6) return picks;
    const remaining = products.filter((p) => !HIGHLIGHT_NAMES.includes(p.name));
    return [...picks, ...remaining].slice(0, 12);
  }, [products]);

  if (isLoading) {
    return (
      <section id="produtos" className="py-20 bg-miami-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="font-body text-sm font-semibold tracking-widest uppercase text-miami-blue mb-2 block">
              Destaques
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Mais Pedidos
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!highlighted.length) return null;

  return (
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

        <div className="max-w-6xl mx-auto px-8 md:px-14">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({ delay: 3500, stopOnInteraction: true }),
            ]}
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
                          R$ {calcBRL(product.price_usd).toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          US$ {product.price_usd.toFixed(2)}
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

        <div className="text-center mt-10">
          <Button
            size="lg"
            className="font-body rounded-full gap-2 px-8 shadow-lg shadow-primary/25"
            asChild
          >
            <Link to="/login">
              Ver catalogo completo
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
