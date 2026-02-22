import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Plane, ShoppingBag, MessageSquare, DollarSign, Tag, Users, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/orders", icon: Package, label: "Pedidos" },
  { to: "/admin/trips", icon: Plane, label: "Viagens" },
  { to: "/admin/catalog", icon: ShoppingBag, label: "Catálogo" },
  { to: "/admin/messages", icon: MessageSquare, label: "Mensagens" },
  { to: "/admin/payments", icon: DollarSign, label: "Pagamentos" },
  { to: "/admin/promotions", icon: Tag, label: "Promoções" },
  { to: "/admin/clients", icon: Users, label: "Clientes" },
  { to: "/admin/settings", icon: Settings, label: "Configurações" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Até logo!");
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b flex items-center justify-between px-4">
        <Logo size="sm" />
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-background border-r flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b">
          <Logo />
          <p className="text-xs text-muted-foreground mt-1">Painel Administrativo</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass} onClick={() => setSidebarOpen(false)}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
