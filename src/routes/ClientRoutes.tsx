import { Route, Navigate } from "react-router-dom";
import ClientLayout from "@/components/client/ClientLayout";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientCatalog from "@/pages/client/ClientCatalog";
import ClientOrders from "@/pages/client/ClientOrders";
import ClientOrderDetail from "@/pages/client/ClientOrderDetail";
import ClientPromotions from "@/pages/client/ClientPromotions";
import ClientProfile from "@/pages/client/ClientProfile";
import ClientWishlist from "@/pages/client/ClientWishlist";
import ClientCart from "@/pages/client/ClientCart";
import ClientCheckout from "@/pages/client/ClientCheckout";
import ClientNotifications from "@/pages/client/ClientNotifications";
import ClientChat from "@/pages/client/ClientChat";
import { RequireClient } from "@/routes/guards";

export function clientRoutes() {
  return (
    <Route
      path="/client"
      element={<RequireClient><ClientLayout /></RequireClient>}
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
      <Route path="chat" element={<ClientChat />} />
    </Route>
  );
}
