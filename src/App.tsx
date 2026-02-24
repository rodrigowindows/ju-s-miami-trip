import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import PublicCatalog from "./pages/PublicCatalog";
import PublicProductPage from "./pages/PublicProductPage";
import BrandPage from "./pages/BrandPage";
import ForgotPassword from "./pages/ForgotPassword";
import Rastreio from "./pages/Rastreio";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Client pages
import ClientLayout from "./components/client/ClientLayout";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientCatalog from "./pages/client/ClientCatalog";
import ClientOrders from "./pages/client/ClientOrders";
import ClientOrderDetail from "./pages/client/ClientOrderDetail";
import ClientPromotions from "./pages/client/ClientPromotions";
import ClientProfile from "./pages/client/ClientProfile";
import ClientWishlist from "./pages/client/ClientWishlist";
import ClientCart from "./pages/client/ClientCart";
import ClientCheckout from "./pages/client/ClientCheckout";
import ClientNotifications from "./pages/client/ClientNotifications";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
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
import AdminProductAlerts from "./pages/admin/AdminProductAlerts";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminDeals from "./pages/admin/AdminDeals";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import { Loader2 } from "lucide-react";
import CookieBanner from "./components/CookieBanner";
import WhatsAppButton from "./components/WhatsAppButton";

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
  if (!user) return <Navigate to="/admin/login" replace />;
  if (profile && profile.role !== "admin") return <Navigate to="/client/dashboard" replace />;

  return <>{children}</>;
}

function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (user && profile) {
    if (profile.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/client/dashboard" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CookieBanner />
        <WhatsAppButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicCatalog />} />
            <Route path="/catalog" element={<PublicCatalog />} />
            <Route path="/rastreio" element={<Rastreio />} />
            <Route path="/produto/:slug" element={<PublicProductPage />} />
            <Route path="/marca/:slug" element={<BrandPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/login"
              element={
                <RedirectIfAuthed>
                  <Login />
                </RedirectIfAuthed>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectIfAuthed>
                  <Register />
                </RedirectIfAuthed>
              }
            />

            {/* Client authenticated routes */}
            <Route
              path="/client"
              element={
                <RequireClient>
                  <CartProvider>
                    <ClientLayout />
                  </CartProvider>
                </RequireClient>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="catalog" element={<ClientCatalog />} />
              <Route path="orders" element={<ClientOrders />} />
              <Route path="orders/:id" element={<ClientOrderDetail />} />
              <Route path="wishlist" element={<ClientWishlist />} />
              <Route path="promos" element={<ClientPromotions />} />
              <Route path="cart" element={<ClientCart />} />
              <Route path="checkout" element={<ClientCheckout />} />
              <Route path="profile" element={<ClientProfile />} />
              <Route path="notifications" element={<ClientNotifications />} />
            </Route>

            {/* Admin login */}
            <Route
              path="/admin/login"
              element={
                <RedirectIfAuthed>
                  <AdminLogin />
                </RedirectIfAuthed>
              }
            />

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
              <Route path="perguntas" element={<AdminQuestions />} />
              <Route path="avaliacoes" element={<AdminReviews />} />
              <Route path="promos" element={<AdminPromos />} />
              <Route path="ofertas" element={<AdminDeals />} />
              <Route path="clients" element={<Clients />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="alertas-produtos" element={<AdminProductAlerts />} />
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
