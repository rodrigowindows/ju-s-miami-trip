import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import ClientLayout from "@/components/client/ClientLayout";
import { RequireClient } from "@/routes/guards";
import { Lazy } from "@/routes/LazyRoute";

export function clientRoutes() {
  return (
    <Route
      path="/client"
      element={<RequireClient><ClientLayout /></RequireClient>}
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
