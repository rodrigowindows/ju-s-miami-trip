import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminPlaceholder from "./pages/admin/Placeholder";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminClients from "./pages/admin/AdminClients";
import AdminSettings from "./pages/admin/AdminSettings";
import Trips from "./pages/admin/Trips";
import TripDetail from "./pages/admin/TripDetail";
import Messages from "./pages/admin/Messages";
import Payments from "./pages/admin/Payments";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import Orders from "./pages/admin/Orders";

// Client pages
import ClientLayout from "./components/client/ClientLayout";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientPromotions from "./pages/client/ClientPromotions";
import ClientOrders from "./pages/client/ClientOrders";
import ClientProfile from "./pages/client/ClientProfile";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (profile?.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="pedidos" element={<AdminPlaceholder />} />
              <Route path="viagens" element={<Trips />} />
              <Route path="viagens/:id" element={<TripDetail />} />
              <Route path="catalogo" element={<AdminPlaceholder />} />
              <Route path="mensagens" element={<Messages />} />
              <Route path="pagamentos" element={<Payments />} />
              <Route path="promocoes" element={<AdminPromotions />} />
              <Route path="clientes" element={<AdminClients />} />
              <Route path="config" element={<AdminSettings />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
            </Route>

            {/* Client */}
            <Route
              path="/client"
              element={
                <RequireAuth>
                  <ClientLayout />
                </RequireAuth>
              }
            >
              <Route index element={<ClientDashboard />} />
              <Route path="promotions" element={<ClientPromotions />} />
              <Route path="orders" element={<ClientOrders />} />
              <Route path="profile" element={<ClientProfile />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
