import { Outlet, NavLink } from "react-router-dom";
import { ShoppingBag, Package, Heart, MessageCircle, User } from "lucide-react";
import { CartDrawer } from "@/components/catalog/CartDrawer";
import PremiumHeader from "@/components/client/PremiumHeader";

const navItems = [
  { to: "/client/catalog", icon: ShoppingBag, label: "Vitrine", end: true },
  { to: "/client/orders", icon: Package, label: "Pedidos" },
  { to: "/client/wishlist", icon: Heart, label: "Desejos" },
  { to: "/client/chat", icon: MessageCircle, label: "Chat" },
  { to: "/client/profile", icon: User, label: "Perfil" },
];

export default function ClientLayout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <div className="min-h-screen bg-white pb-20">
      <PremiumHeader />

      <main className="px-4 py-4 max-w-7xl mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#eee] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-center justify-around py-2.5 max-w-lg mx-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <CartDrawer />
    </div>
  );
}
