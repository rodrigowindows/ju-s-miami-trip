import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag, TrendingUp } from "lucide-react";
import AdminAISummary from "@/components/admin/AdminAISummary";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardCharts from "@/components/admin/DashboardCharts";
import DashboardKanban from "@/components/admin/DashboardKanban";
import ShoppingProgress from "@/components/admin/ShoppingProgress";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import { useOrders } from "@/hooks/useOrders";
import { usePayments } from "@/hooks/usePayments";
import type { Order } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  novo: "#9CA3AF", orcamento: "#EAB308", aprovado: "#3B82F6", comprando: "#F97316",
  comprado: "#14B8A6", em_transito: "#8B5CF6", chegou_brasil: "#22C55E", entregue: "#059669", cancelado: "#EF4444",
};
const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function Dashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const navigate = useNavigate();

  const isLoading = ordersLoading || paymentsLoading;

  const stats = useMemo(() => {
    if (!orders) return { total: 0, active: 0, revenue: 0, pending: 0, delivered: 0, clients: 0, cancelledCount: 0 };
    const cancelledCount = orders.filter((o) => o.status === "cancelado").length;
    const active = orders.filter((o) => !["entregue", "cancelado"].includes(o.status)).length;
    const revenue = orders.filter((o) => o.status !== "cancelado").reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
    const pending = orders.filter((o) => o.status === "novo").length;
    const delivered = orders.filter((o) => o.status === "entregue").length;
    const clients = new Set(orders.map((o) => o.client_id)).size;
    return { total: orders.length, active, revenue, pending, delivered, clients, cancelledCount };
  }, [orders]);

  const revenueByMonth = useMemo(() => {
    if (!payments) return [];
    const map = new Map<string, { receita: number; reembolso: number }>();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      map.set(`${MONTHS_PT[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`, { receita: 0, reembolso: 0 });
    }
    for (const p of payments) {
      const d = new Date(p.created_at);
      const key = `${MONTHS_PT[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
      const entry = map.get(key);
      if (entry) { p.type === "refund" ? (entry.reembolso += p.amount) : (entry.receita += p.amount); }
    }
    return Array.from(map.entries()).map(([name, vals]) => ({ name, ...vals }));
  }, [payments]);

  const ordersByStatus = useMemo(() => {
    if (!orders) return [];
    const counts = new Map<string, number>();
    for (const o of orders) counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
    return Array.from(counts.entries()).map(([status, value]) => ({
      name: ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG]?.label ?? status,
      value,
      color: STATUS_COLORS[status] ?? "#6B7280",
    }));
  }, [orders]);

  const ordersTimeline = useMemo(() => {
    if (!orders) return [];
    const weeks = new Map<string, number>();
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = `${String(weekStart.getDate()).padStart(2, "0")}/${String(weekStart.getMonth() + 1).padStart(2, "0")}`;
      weeks.set(key, 0);
    }
    for (const o of orders) {
      const d = new Date(o.created_at);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = `${String(weekStart.getDate()).padStart(2, "0")}/${String(weekStart.getMonth() + 1).padStart(2, "0")}`;
      if (weeks.has(key)) weeks.set(key, (weeks.get(key) ?? 0) + 1);
    }
    return Array.from(weeks.entries()).map(([name, pedidos]) => ({ name, pedidos }));
  }, [orders]);

  const topClients = useMemo(() => {
    if (!orders) return [];
    const map = new Map<string, { name: string; total: number; count: number }>();
    for (const o of orders) {
      if (o.status === "cancelado") continue;
      const name = o.client?.full_name ?? "Desconhecido";
      const entry = map.get(o.client_id) ?? { name, total: 0, count: 0 };
      entry.total += o.total_amount ?? 0;
      entry.count += 1;
      map.set(o.client_id, entry);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [orders]);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-full mx-auto space-y-6">
      <AdminAISummary />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do AjuVaiParaMiami</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate("/admin/orders")}>
            <ShoppingBag size={14} className="mr-1" /> Pedidos
          </Button>
          <Button size="sm" onClick={() => navigate("/admin/catalog")}>
            <TrendingUp size={14} className="mr-1" /> Catálogo
          </Button>
        </div>
      </div>

      <DashboardStats stats={stats} />
      <ShoppingProgress />
      <DashboardCharts
        revenueByMonth={revenueByMonth}
        ordersByStatus={ordersByStatus}
        ordersTimeline={ordersTimeline}
        topClients={topClients}
      />
      <DashboardKanban orders={orders ?? []} />
    </div>
  );
}
