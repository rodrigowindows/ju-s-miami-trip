import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import type { ReactNode } from "react";

import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPlaceholder from "@/pages/admin/Placeholder";
import Trips from "@/pages/admin/Trips";
import TripDetail from "@/pages/admin/TripDetail";
import Messages from "@/pages/admin/Messages";
import Payments from "@/pages/admin/Payments";
import OrderDetail from "@/pages/admin/OrderDetail";
import ClientHome from "@/pages/client/Home";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AuthRedirect() {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  return <ClientHome />;
}

function LoginGuard() {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user && role === "admin") return <Navigate to="/admin" replace />;
  if (user) return <Navigate to="/" replace />;
  return <Login />;
}

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginGuard />} />

            {/* Client (authenticated) */}
            <Route path="/" element={<AuthRedirect />} />

            {/* Admin routes */}
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
              <Route index element={<AdminDashboard />} />
              <Route path="pedidos" element={<AdminPlaceholder />} />
              <Route path="viagens" element={<Trips />} />
              <Route path="viagens/:id" element={<TripDetail />} />
              <Route path="catalogo" element={<AdminPlaceholder />} />
              <Route path="mensagens" element={<Messages />} />
              <Route path="pagamentos" element={<Payments />} />
              <Route path="promocoes" element={<AdminPlaceholder />} />
              <Route path="clientes" element={<AdminPlaceholder />} />
              <Route path="config" element={<AdminPlaceholder />} />
              <Route path="orders/:id" element={<OrderDetail />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
