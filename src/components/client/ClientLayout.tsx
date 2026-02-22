import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Tag, User } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/client/catalog", icon: ShoppingBag, label: "Vitrine", end: true },
  { to: "/client/orders", icon: Package, label: "Pedidos" },
  { to: "/client/promos", icon: Tag, label: "Ofertas" },
  { to: "/client/profile", icon: User, label: "Perfil" },
];

export default function ClientLayout() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        {profile && (
          <button onClick={() => navigate("/client/profile")} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Olá, {profile.full_name?.split(" ")[0]}
          </button>
        )}
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t safe-area-pb">
        <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
