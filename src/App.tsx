import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ClientLayout from "./components/client/ClientLayout";
import Catalog from "./pages/client/Catalog";
import Orders from "./pages/client/Orders";
import ClientOrderDetail from "./pages/client/OrderDetail";
import Promos from "./pages/client/Promos";
import Profile from "./pages/client/Profile";
import AdminLayout from "./components/admin/AdminLayout";
import Trips from "./pages/admin/Trips";
import TripDetail from "./pages/admin/TripDetail";
import Messages from "./pages/admin/Messages";
import Payments from "./pages/admin/Payments";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import { Loader2 } from "lucide-react";

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
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
                <RequireAuth>
                  <ClientLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="catalog" replace />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<ClientOrderDetail />} />
              <Route path="promos" element={<Promos />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Admin panel */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/trips" replace />} />
              <Route path="trips" element={<Trips />} />
              <Route path="trips/:id" element={<TripDetail />} />
              <Route path="messages" element={<Messages />} />
              <Route path="payments" element={<Payments />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
