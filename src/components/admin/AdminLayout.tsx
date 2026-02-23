import { useState } from "react";
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
  MoreHorizontal,
  X,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/trips", label: "Viagens", icon: Plane },
  { to: "/admin/catalogo", label: "Catálogo", icon: Store },
  { to: "/admin/messages", label: "Mensagens", icon: MessageSquare },
  { to: "/admin/payments", label: "Pagamentos", icon: DollarSign },
  { to: "/admin/perguntas", label: "Perguntas", icon: HelpCircle },
  { to: "/admin/promos", label: "Promoções", icon: Tag },
  { to: "/admin/clients", label: "Clientes", icon: Users },
  { to: "/admin/settings", label: "Config", icon: Settings },
];

const AdminLayout = () => {
  const { signOut } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t safe-area-pb">
        <div className="flex">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors min-h-[56px] justify-center",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium text-muted-foreground min-h-[56px] justify-center"
          >
            <MoreHorizontal size={20} />
            Mais
          </button>
        </div>
      </div>

      {/* Mobile "More" drawer */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl safe-area-pb animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-sm">Menu</span>
              <button onClick={() => setMoreOpen(false)} className="p-2 -m-1">
                <X size={20} />
              </button>
            </div>
            <nav className="p-2 space-y-0.5 max-h-[60vh] overflow-y-auto">
              {navItems.slice(4).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
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
            <div className="p-2 border-t">
              <button
                onClick={() => { signOut(); setMoreOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
