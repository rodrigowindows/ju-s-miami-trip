import { useEffect, useCallback, useState } from "react";
import { ArrowRight, Tag, Package, Wallet, ShoppingBag, Zap, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { formatBRL } from "@/lib/format";
import useEmblaCarousel from "embla-carousel-react";

const BANNERS = [
  {
    title: "Novidades da semana",
    subtitle: "Confira os produtos que acabaram de chegar",
    gradient: "from-violet-600 to-indigo-600",
    icon: Sparkles,
    cta: "Ver vitrine",
    to: "/client/catalog",
  },
  {
    title: "Use cupom MIAMI10",
    subtitle: "10% de desconto na sua proxima compra",
    gradient: "from-orange-500 to-rose-500",
    icon: Tag,
    cta: "Ver ofertas",
    to: "/client/promos",
  },
  {
    title: "Indique amigos",
    subtitle: "Ganhe R$ 30 para cada amigo que comprar",
    gradient: "from-emerald-500 to-teal-600",
    icon: Users,
    cta: "Saiba mais",
    to: "/client/profile",
  },
  {
    title: "Ofertas relampago",
    subtitle: "Descontos por tempo limitado em produtos selecionados",
    gradient: "from-red-600 to-pink-600",
    icon: Zap,
    cta: "Aproveitar",
    to: "/client/catalog",
  },
];

function BannerCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="overflow-hidden rounded-xl -mx-4">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {BANNERS.map((banner, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 px-4">
              <Link to={banner.to}>
                <div className={`bg-gradient-to-br ${banner.gradient} rounded-xl p-5 text-white relative overflow-hidden min-h-[140px] flex flex-col justify-between`}>
                  <banner.icon className="absolute top-4 right-4 h-16 w-16 opacity-15" />
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{banner.title}</h3>
                    <p className="text-sm opacity-90 mt-1">{banner.subtitle}</p>
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full text-xs w-fit px-4"
                  >
                    {banner.cta}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all ${
              i === selectedIndex ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { profile } = useAuth();

  const quickLinks = [
    { to: "/client/catalog", icon: ShoppingBag, label: "Vitrine", description: "Produtos disponiveis de Miami", color: "from-miami-sand/30 to-miami-orange/10", iconColor: "text-miami-orange" },
    { to: "/client/orders", icon: Package, label: "Meus Pedidos", description: "Acompanhe seus pedidos", color: "from-secondary/10 to-miami-blue/10", iconColor: "text-secondary" },
    { to: "/client/promos", icon: Tag, label: "Ofertas Especiais", description: "Cupons e descontos", color: "from-primary/10 to-miami-orange/10", iconColor: "text-primary" },
    { to: "/client/profile", icon: Wallet, label: "Minha Wallet", description: `Saldo: ${formatBRL(profile?.wallet_balance ?? 0)}`, color: "from-emerald-50 to-emerald-100/50", iconColor: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <h1 className="font-display text-2xl font-bold">Ola, {profile?.full_name?.split(" ")[0] ?? "Cliente"}!</h1>
        <p className="text-sm text-muted-foreground mt-1">Bem-vindo(a) a AjuVaiParaMiami. O que deseja fazer?</p>
      </div>

      {/* Banner Carousel */}
      <BannerCarousel />

      <Card className="bg-gradient-to-r from-primary to-miami-orange text-white overflow-hidden">
        <CardContent className="py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Saldo Wallet</p>
              <p className="text-3xl font-bold mt-1">{formatBRL(profile?.wallet_balance ?? 0)}</p>
            </div>
            <Wallet className="h-10 w-10 opacity-30" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to}>
            <Card className={`bg-gradient-to-r ${link.color} hover:shadow-md transition-shadow`}>
              <CardContent className="py-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-lg bg-white/80 ${link.iconColor}`}><link.icon className="h-5 w-5" /></div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
