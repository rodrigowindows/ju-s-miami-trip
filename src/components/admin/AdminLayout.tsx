import { NavLink, Outlet } from "react-router-dom";
import {
  Plane,
  MessageSquare,
  DollarSign,
  LayoutDashboard,
  ShoppingBag,
  Store,
  Tag,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/trips", label: "Viagens", icon: Plane },
  { to: "/admin/catalogo", label: "Catálogo", icon: Store },
  { to: "/admin/messages", label: "Mensagens", icon: MessageSquare },
  { to: "/admin/payments", label: "Pagamentos", icon: DollarSign },
  { to: "/admin/promos", label: "Promoções", icon: Tag },
  { to: "/admin/clients", label: "Clientes", icon: Users },
  { to: "/admin/settings", label: "Config", icon: Settings },
];

const AdminLayout = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="font-display text-lg font-bold flex items-center gap-2">
            <LayoutDashboard size={20} />
            MalaBridge
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Painel Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t flex overflow-x-auto">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors min-w-[64px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
