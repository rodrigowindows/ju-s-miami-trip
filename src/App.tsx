import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import CookieBanner from "./components/CookieBanner";
import WhatsAppButton from "./components/WhatsAppButton";
import { publicRoutes } from "@/routes/PublicRoutes";
import { clientRoutes } from "@/routes/ClientRoutes";
import { adminRoutes } from "@/routes/AdminRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,      // 2 min — avoid refetching on every mount
      gcTime: 10 * 60 * 1000,         // 10 min garbage collection
      retry: 1,                        // single retry on failure
      refetchOnWindowFocus: false,     // prevent unnecessary refetches
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CookieBanner />
        <WhatsAppButton />
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {publicRoutes()}
              {clientRoutes()}
              {adminRoutes()}
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
