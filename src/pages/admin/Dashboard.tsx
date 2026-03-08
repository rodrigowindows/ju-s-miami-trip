import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/useOrders";
import { usePayments } from "@/hooks/usePayments";
import { Loader2, ShoppingBag, DollarSign, Plane, Clock, TrendingUp, Users } from "lucide-react";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import type { OrderWithClient } from "@/types";
import { KANBAN_COLUMNS } from "@/types";
import { formatBRL } from "@/lib/format";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  novo: "#9CA3AF",
  orcamento: "#EAB308",
  aprovado: "#3B82F6",
  comprando: "#F97316",
  comprado: "#14B8A6",
  em_transito: "#8B5CF6",
  chegou_brasil: "#22C55E",
  entregue: "#059669",
  cancelado: "#EF4444",
};

const MONTHS_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-gray-600">
          {p.name}: {p.name === "Pedidos" ? p.value : formatBRL(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: payments, isLoading: paymentsLoading } = usePayments();
  const navigate = useNavigate();

  const isLoading = ordersLoading || paymentsLoading;

  const stats = useMemo(() => {
    if (!orders) return { total: 0, active: 0, revenue: 0, pending: 0, delivered: 0, clients: 0 };
    const active = orders.filter((o) => !["entregue", "cancelado"].includes(o.status)).length;
    const revenue = orders.filter((o) => o.status !== "cancelado").reduce((sum, o) => sum + (o.total_amount ?? 0), 0);
    const pending = orders.filter((o) => o.status === "novo").length;
    const delivered = orders.filter((o) => o.status === "entregue").length;
    const clients = new Set(orders.map((o) => o.client_id)).size;
    return { total: orders.length, active, revenue, pending, delivered, clients };
  }, [orders]);

  // Revenue by month (bar chart)
  const revenueByMonth = useMemo(() => {
    if (!payments) return [];
    const map = new Map<string, { receita: number; reembolso: number }>();

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${MONTHS_PT[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
      map.set(key, { receita: 0, reembolso: 0 });
    }

    for (const p of payments) {
      const d = new Date(p.created_at);
      const key = `${MONTHS_PT[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
      const entry = map.get(key);
      if (entry) {
        if (p.type === "refund") entry.reembolso += p.amount;
        else entry.receita += p.amount;
      }
    }

    return Array.from(map.entries()).map(([name, vals]) => ({ name, ...vals }));
  }, [payments]);

  // Orders by status (pie chart)
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

  // Orders timeline (area chart - per week)
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

  // Top clients
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

  const columns = useMemo(() => {
    if (!orders) return {};
    const grouped: Record<string, OrderWithClient[]> = {};
    for (const col of KANBAN_COLUMNS) {
      grouped[col.id] = orders.filter((o) => col.statuses.includes(o.status as typeof col.statuses[number]));
    }
    return grouped;
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

      {/* Ticket Médio */}
      {stats.total > 0 && (
        <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200">
          <CardContent className="py-3 px-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-violet-600 font-medium">Ticket Médio</p>
              <p className="text-lg font-bold text-violet-800">{formatBRL(stats.revenue / (stats.total - (orders?.filter(o => o.status === "cancelado").length ?? 0) || 1))}</p>
            </div>
            <div>
              <p className="text-xs text-violet-600 font-medium">Taxa de Conversão</p>
              <p className="text-lg font-bold text-violet-800">{stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%</p>
            </div>
            <div>
              <p className="text-xs text-violet-600 font-medium">Pedidos Pendentes</p>
              <p className="text-lg font-bold text-amber-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
      )

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><ShoppingBag size={20} className="text-blue-600" /></div>
            <div className="min-w-0"><p className="text-lg font-bold">{stats.total}</p><p className="text-[11px] text-muted-foreground">Total pedidos</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0"><Clock size={20} className="text-amber-600" /></div>
            <div className="min-w-0"><p className="text-lg font-bold">{stats.active}</p><p className="text-[11px] text-muted-foreground">Ativos</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0"><DollarSign size={20} className="text-green-600" /></div>
            <div className="min-w-0"><p className="text-lg font-bold truncate">{formatBRL(stats.revenue)}</p><p className="text-[11px] text-muted-foreground">Receita</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0"><Plane size={20} className="text-orange-600" /></div>
            <div className="min-w-0"><p className="text-lg font-bold">{stats.pending}</p><p className="text-[11px] text-muted-foreground">Para orçar</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0"><TrendingUp size={20} className="text-violet-600" /></div>
            <div className="min-w-0"><p className="text-lg font-bold">{stats.delivered}</p><p className="text-[11px] text-muted-foreground">Entregues</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0"><Users size={20} className="text-sky-600" /></div>
            <div className="min-w-0"><p className="text-lg font-bold">{stats.clients}</p><p className="text-[11px] text-muted-foreground">Clientes</p></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="receita" name="Receita" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reembolso" name="Reembolso" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Pedidos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ordersByStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [value, "Pedidos"]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Pedidos por Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ordersTimeline} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradientPedidos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="pedidos" name="Pedidos" stroke="#8B5CF6" strokeWidth={2} fill="url(#gradientPedidos)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Clientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topClients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum cliente</p>
            ) : (
              topClients.map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-500"
                    }`}>{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground">{c.count} pedido{c.count !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-violet-600 shrink-0">{formatBRL(c.total)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Kanban */}
      <div>
        <h2 className="font-display text-lg font-bold mb-4">Kanban de Pedidos</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const colOrders = columns[col.id] ?? [];
            return (
              <div key={col.id} className="sm:min-w-[240px] sm:flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold">{col.title}</h3>
                  <span className="text-xs bg-muted rounded-full px-2 py-0.5 font-medium">{colOrders.length}</span>
                </div>
                <div className="space-y-2">
                  {colOrders.length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <p className="text-xs text-muted-foreground">Nenhum pedido</p>
                    </div>
                  ) : (
                    colOrders.map((order) => (
                      <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold">{order.order_number}</span>
                            <Badge className={`${ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG]?.color ?? ""} text-[10px] border-0`}>
                              {ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG]?.label ?? order.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium truncate">{order.client?.full_name ?? "Cliente"}</p>
                          {order.items && <p className="text-xs text-muted-foreground truncate">{order.items}</p>}
                          {order.total_amount && <p className="text-xs font-semibold text-violet-600">{formatBRL(order.total_amount)}</p>}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
