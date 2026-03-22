import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { RedirectIfAuthed, RequireAdmin } from "@/routes/guards";
import { Lazy } from "@/routes/LazyRoute";

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const OrdersList = lazy(() => import("@/pages/admin/OrdersList"));
const Trips = lazy(() => import("@/pages/admin/Trips"));
const TripDetail = lazy(() => import("@/pages/admin/TripDetail"));
const AdminCatalog = lazy(() => import("@/pages/admin/AdminCatalog"));
const Messages = lazy(() => import("@/pages/admin/Messages"));
const Payments = lazy(() => import("@/pages/admin/Payments"));
const AdminPromos = lazy(() => import("@/pages/admin/AdminPromos"));
const Clients = lazy(() => import("@/pages/admin/Clients"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminProductAlerts = lazy(() => import("@/pages/admin/AdminProductAlerts"));
const AdminQuestions = lazy(() => import("@/pages/admin/AdminQuestions"));
const AdminDeals = lazy(() => import("@/pages/admin/AdminDeals"));
const AdminReviews = lazy(() => import("@/pages/admin/AdminReviews"));
const AdminOrderDetail = lazy(() => import("@/pages/admin/OrderDetail"));
const AdminAnalytics = lazy(() => import("@/pages/admin/AdminAnalytics"));
const AdminChat = lazy(() => import("@/pages/admin/AdminChat"));
const AdminShoppingList = lazy(() => import("@/pages/admin/AdminShoppingList"));

export function adminRoutes() {
  return (
    <>
      <Route
        path="/admin/login"
        element={<RedirectIfAuthed><Lazy><AdminLogin /></Lazy></RedirectIfAuthed>}
      />
      <Route
        path="/admin"
        element={<RequireAdmin><AdminLayout /></RequireAdmin>}
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Lazy><Dashboard /></Lazy>} />
        <Route path="pedidos" element={<Lazy><OrdersList /></Lazy>} />
        <Route path="trips" element={<Lazy><Trips /></Lazy>} />
        <Route path="trips/:id" element={<Lazy><TripDetail /></Lazy>} />
        <Route path="catalogo" element={<Lazy><AdminCatalog /></Lazy>} />
        <Route path="messages" element={<Lazy><Messages /></Lazy>} />
        <Route path="payments" element={<Lazy><Payments /></Lazy>} />
        <Route path="perguntas" element={<Lazy><AdminQuestions /></Lazy>} />
        <Route path="avaliacoes" element={<Lazy><AdminReviews /></Lazy>} />
        <Route path="promos" element={<Lazy><AdminPromos /></Lazy>} />
        <Route path="ofertas" element={<Lazy><AdminDeals /></Lazy>} />
        <Route path="clients" element={<Lazy><Clients /></Lazy>} />
        <Route path="analytics" element={<Lazy><AdminAnalytics /></Lazy>} />
        <Route path="settings" element={<Lazy><AdminSettings /></Lazy>} />
        <Route path="chat" element={<Lazy><AdminChat /></Lazy>} />
        <Route path="alertas-produtos" element={<Lazy><AdminProductAlerts /></Lazy>} />
        <Route path="pedidos/:id" element={<Lazy><AdminOrderDetail /></Lazy>} />
        <Route path="lista-compras" element={<Lazy><AdminShoppingList /></Lazy>} />
      </Route>
    </>
  );
}
