import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Store, ShoppingBag, Tag, User } from "lucide-react";

const navItems = [
  { label: "Vitrine", icon: Store, path: "/client/catalog" },
  { label: "Meus Pedidos", icon: ShoppingBag, path: "/client/orders" },
  { label: "Promoções", icon: Tag, path: "/client/promos" },
  { label: "Perfil", icon: User, path: "/client/profile" },
];

export default function ClientLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/client/catalog" && location.pathname === "/client") ||
              (item.path !== "/client/catalog" && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
                  isActive
                    ? "text-violet-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
