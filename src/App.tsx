import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// Client pages
import ClientLayout from "./components/client/ClientLayout";
import Catalog from "./pages/client/Catalog";
import ClientOrders from "./pages/client/Orders";
import ClientOrderDetail from "./pages/client/OrderDetail";
import Promos from "./pages/client/Promos";
import Profile from "./pages/client/Profile";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import OrdersList from "./pages/admin/OrdersList";
import Trips from "./pages/admin/Trips";
import TripDetail from "./pages/admin/TripDetail";
import AdminCatalog from "./pages/admin/AdminCatalog";
import Messages from "./pages/admin/Messages";
import Payments from "./pages/admin/Payments";
import AdminPromos from "./pages/admin/AdminPromos";
import Clients from "./pages/admin/Clients";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminOrderDetail from "./pages/admin/OrderDetail";

import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function RequireClient({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile && profile.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile && profile.role !== "admin") return <Navigate to="/client/catalog" replace />;

  return <>{children}</>;
}

function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (user && profile) {
    if (profile.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/client/catalog" replace />;
  }

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
            <Route path="/" element={<Index />} />
            <Route
              path="/login"
              element={
                <RedirectIfAuthed>
                  <Login />
                </RedirectIfAuthed>
              }
            />

            {/* Client authenticated routes */}
            <Route
              path="/client"
              element={
                <RequireClient>
                  <ClientLayout />
                </RequireClient>
              }
            >
              <Route index element={<Navigate to="catalog" replace />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="orders" element={<ClientOrders />} />
              <Route path="orders/:id" element={<ClientOrderDetail />} />
              <Route path="promos" element={<Promos />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin authenticated routes */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pedidos" element={<OrdersList />} />
              <Route path="trips" element={<Trips />} />
              <Route path="trips/:id" element={<TripDetail />} />
              <Route path="catalogo" element={<AdminCatalog />} />
              <Route path="messages" element={<Messages />} />
              <Route path="payments" element={<Payments />} />
              <Route path="promos" element={<AdminPromos />} />
              <Route path="clients" element={<Clients />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
