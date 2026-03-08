import { lazy, Suspense } from "react";
import { Route, Navigate } from "react-router-dom";
import ClientLayout from "@/components/client/ClientLayout";
import { CartProvider } from "@/contexts/CartContext";
import { RequireClient } from "@/routes/guards";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";

const ClientDashboard = lazy(() => import("@/pages/client/ClientDashboard"));
const ClientCatalog = lazy(() => import("@/pages/client/ClientCatalog"));
const ClientOrders = lazy(() => import("@/pages/client/ClientOrders"));
const ClientOrderDetail = lazy(() => import("@/pages/client/ClientOrderDetail"));
const ClientPromotions = lazy(() => import("@/pages/client/ClientPromotions"));
const ClientProfile = lazy(() => import("@/pages/client/ClientProfile"));
const ClientWishlist = lazy(() => import("@/pages/client/ClientWishlist"));
const ClientCart = lazy(() => import("@/pages/client/ClientCart"));
const ClientCheckout = lazy(() => import("@/pages/client/ClientCheckout"));
const ClientNotifications = lazy(() => import("@/pages/client/ClientNotifications"));
const ClientChat = lazy(() => import("@/pages/client/ClientChat"));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8"><PageSkeleton /></div>}>{children}</Suspense>;
}

export function clientRoutes() {
  return (
    <Route
      path="/client"
      element={<RequireClient><CartProvider><ClientLayout /></CartProvider></RequireClient>}
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Lazy><ClientDashboard /></Lazy>} />
      <Route path="catalog" element={<Lazy><ClientCatalog /></Lazy>} />
      <Route path="orders" element={<Lazy><ClientOrders /></Lazy>} />
      <Route path="orders/:id" element={<Lazy><ClientOrderDetail /></Lazy>} />
      <Route path="wishlist" element={<Lazy><ClientWishlist /></Lazy>} />
      <Route path="promos" element={<Lazy><ClientPromotions /></Lazy>} />
      <Route path="cart" element={<Lazy><ClientCart /></Lazy>} />
      <Route path="checkout" element={<Lazy><ClientCheckout /></Lazy>} />
      <Route path="profile" element={<Lazy><ClientProfile /></Lazy>} />
      <Route path="notifications" element={<Lazy><ClientNotifications /></Lazy>} />
      <Route path="chat" element={<Lazy><ClientChat /></Lazy>} />
    </Route>
  );
}
