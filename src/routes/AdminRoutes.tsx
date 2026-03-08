import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { RedirectIfAuthed, RequireAdmin } from "@/routes/guards";
import { Lazy } from "@/routes/LazyRoute";

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
        <Route path="orders/:id" element={<Lazy><AdminOrderDetail /></Lazy>} />
      </Route>
    </>
  );
}
