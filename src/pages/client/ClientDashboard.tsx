import { ArrowRight, Tag, Package, Wallet, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientDashboard() {
  const { profile } = useAuth();

  const quickLinks = [
    { to: "/client/catalog", icon: ShoppingBag, label: "Vitrine", description: "Produtos disponíveis de Miami", color: "from-miami-sand/30 to-miami-orange/10", iconColor: "text-miami-orange" },
    { to: "/client/orders", icon: Package, label: "Meus Pedidos", description: "Acompanhe seus pedidos", color: "from-secondary/10 to-miami-blue/10", iconColor: "text-secondary" },
    { to: "/client/promotions", icon: Tag, label: "Ofertas Especiais", description: "Cupons e descontos", color: "from-primary/10 to-miami-orange/10", iconColor: "text-primary" },
    { to: "/client/profile", icon: Wallet, label: "Minha Wallet", description: `Saldo: R$ ${(profile?.wallet_balance ?? 0).toFixed(2)}`, color: "from-emerald-50 to-emerald-100/50", iconColor: "text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <h1 className="font-display text-2xl font-bold">Olá, {profile?.full_name?.split(" ")[0] ?? "Cliente"}!</h1>
        <p className="text-sm text-muted-foreground mt-1">Bem-vindo(a) à MalaBridge. O que deseja fazer?</p>
      </div>

      <Card className="bg-gradient-to-r from-primary to-miami-orange text-white overflow-hidden">
        <CardContent className="py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Saldo Wallet</p>
              <p className="text-3xl font-bold mt-1">R$ {(profile?.wallet_balance ?? 0).toFixed(2)}</p>
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
