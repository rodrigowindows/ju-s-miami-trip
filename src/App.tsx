import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminTrips from "./pages/admin/AdminTrips";
import AdminCatalog from "./pages/admin/AdminCatalog";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminClients from "./pages/admin/AdminClients";
import AdminSettings from "./pages/admin/AdminSettings";

// Client pages
import ClientLayout from "./components/client/ClientLayout";
import ClientCatalog from "./pages/client/ClientCatalog";
import ClientOrders from "./pages/client/ClientOrders";
import ClientPromotions from "./pages/client/ClientPromotions";
import ClientProfile from "./pages/client/ClientProfile";

const queryClient = new QueryClient();

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
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="trips" element={<AdminTrips />} />
              <Route path="catalog" element={<AdminCatalog />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="promotions" element={<AdminPromotions />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Client */}
            <Route
              path="/client"
              element={
                <ProtectedRoute requiredRole="cliente">
                  <ClientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/client/catalog" replace />} />
              <Route path="catalog" element={<ClientCatalog />} />
              <Route path="orders" element={<ClientOrders />} />
              <Route path="promotions" element={<ClientPromotions />} />
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
