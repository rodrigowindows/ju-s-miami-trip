import { Route, Navigate } from "react-router-dom";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import OrdersList from "@/pages/admin/OrdersList";
import Trips from "@/pages/admin/Trips";
import TripDetail from "@/pages/admin/TripDetail";
import AdminCatalog from "@/pages/admin/AdminCatalog";
import Messages from "@/pages/admin/Messages";
import Payments from "@/pages/admin/Payments";
import AdminPromos from "@/pages/admin/AdminPromos";
import Clients from "@/pages/admin/Clients";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminProductAlerts from "@/pages/admin/AdminProductAlerts";
import AdminQuestions from "@/pages/admin/AdminQuestions";
import AdminDeals from "@/pages/admin/AdminDeals";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminOrderDetail from "@/pages/admin/OrderDetail";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminChat from "@/pages/admin/AdminChat";
import { RedirectIfAuthed, RequireAdmin } from "@/routes/guards";

export function adminRoutes() {
  return (
    <>
      <Route
        path="/admin/login"
        element={<RedirectIfAuthed><AdminLogin /></RedirectIfAuthed>}
      />
      <Route
        path="/admin"
        element={<RequireAdmin><AdminLayout /></RequireAdmin>}
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
        <Route path="chat" element={<AdminChat />} />
        <Route path="alertas-produtos" element={<AdminProductAlerts />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
      </Route>
    </>
  );
}
