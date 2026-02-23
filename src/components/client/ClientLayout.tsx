import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Tag, User, ShoppingCart } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/catalog/CartDrawer";

const navItems = [
  { to: "/client/catalog", icon: ShoppingBag, label: "Vitrine", end: true },
  { to: "/client/orders", icon: Package, label: "Pedidos" },
  { to: "/client/promos", icon: Tag, label: "Ofertas" },
  { to: "/client/profile", icon: User, label: "Perfil" },
];

export default function ClientLayout() {
  const { profile } = useAuth();
  const { totalItems, openCart } = useCart();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E47911] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
          {profile && (
            <button onClick={() => navigate("/client/profile")} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Ola, {profile.full_name?.split(" ")[0]}
            </button>
          )}
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-[env(safe-area-inset-bottom,0px)]">
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
