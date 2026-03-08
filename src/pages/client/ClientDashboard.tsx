import { useEffect, useCallback, useState, useMemo } from "react";
import { ArrowRight, Tag, Package, Wallet, ShoppingBag, Zap, Users, Sparkles, Trophy, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { formatBRL } from "@/lib/format";
import { useWalletTransactions } from "@/hooks/useWallet";
import { useClientOrders } from "@/hooks/useOrders";
import useEmblaCarousel from "embla-carousel-react";
import WelcomeModal from "@/components/client/WelcomeModal";

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
  const { profile, user } = useAuth();
  const { data: transactions } = useWalletTransactions(user?.id ?? "");
  const { data: orders } = useClientOrders(user?.id ?? "");

  const loyaltyEarned = useMemo(() => {
    if (!transactions) return 0;
    return transactions
      .filter((t) => t.type === "loyalty_credit")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const quickLinks = [
    { to: "/client/catalog", icon: ShoppingBag, label: "Vitrine", description: "Produtos disponiveis de Miami", color: "from-miami-sand/30 to-miami-orange/10", iconColor: "text-miami-orange" },
    { to: "/client/orders", icon: Package, label: "Meus Pedidos", description: "Acompanhe seus pedidos", color: "from-secondary/10 to-miami-blue/10", iconColor: "text-secondary" },
    { to: "/client/chat", icon: MessageCircle, label: "Chat com Suporte", description: "Fale conosco em tempo real", color: "from-blue-50 to-blue-100/50", iconColor: "text-blue-600" },
    { to: "/client/promos", icon: Tag, label: "Ofertas Especiais", description: "Cupons e descontos", color: "from-primary/10 to-miami-orange/10", iconColor: "text-primary" },
  ];

  // Active orders summary
  const activeOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => !["entregue", "cancelado"].includes(o.status)).slice(0, 3);
  }, [orders]);

  return (
    <div className="space-y-6">
      <WelcomeModal />
      <div className="pt-2">
        <h1 className="font-display text-2xl font-bold">Olá, {profile?.full_name?.split(" ")[0] ?? "Cliente"}!</h1>
        <p className="text-sm text-muted-foreground mt-1">Bem-vindo(a) à AjuVaiParaMiami. O que deseja fazer?</p>
      </div>

      <BannerCarousel />

      {/* Active orders preview */}
      {activeOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Package size={16} className="text-muted-foreground" /> Pedidos em andamento
            </h2>
            <Link to="/client/orders" className="text-xs text-primary font-medium">Ver todos →</Link>
          </div>
          {activeOrders.map((order) => (
            <Link key={order.id} to={`/client/orders/${order.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground truncate">{order.items}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {order.status === "novo" ? "Recebido" :
                     order.status === "orcamento" ? "Orçamento" :
                     order.status === "comprando" ? "Comprando" :
                     order.status === "em_transito" ? "Em trânsito" :
                     order.status}
                  </Badge>
                  <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Wallet + Loyalty */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-r from-primary to-miami-orange text-white overflow-hidden">
          <CardContent className="py-4 px-4">
            <p className="text-xs opacity-90">Saldo Wallet</p>
            <p className="text-2xl font-bold mt-1">{formatBRL(profile?.wallet_balance ?? 0)}</p>
            <Wallet className="h-8 w-8 opacity-20 mt-1" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-700 text-white overflow-hidden">
          <CardContent className="py-4 px-4">
            <p className="text-xs opacity-90">Cashback Ganho</p>
            <p className="text-2xl font-bold mt-1">{formatBRL(loyaltyEarned)}</p>
            <div className="flex items-center gap-1 mt-1">
              <Trophy className="h-4 w-4 opacity-70" />
              <span className="text-[10px] opacity-80">5% de volta em cada compra</span>
            </div>
          </CardContent>
        </Card>
      </div>

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
