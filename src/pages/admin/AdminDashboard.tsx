import { Package, Users, Tag, DollarSign, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/useOrders";
import { useClients } from "@/hooks/useClients";
import { usePromotions } from "@/hooks/usePromotions";
import { useTrips } from "@/hooks/useTrips";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/types";
import type { OrderWithClient, OrderStatus } from "@/lib/types";
import { format } from "date-fns";

const KANBAN_COLS: OrderStatus[] = ["novo", "orcamento", "aprovado", "comprando", "comprado", "em_transito", "chegou_brasil", "entregue"];

export default function AdminDashboard() {
  const { data: orders } = useOrders();
  const { data: clients } = useClients();
  const { data: promotions } = usePromotions();
  const { data: trips } = useTrips();

  const activePromos = promotions?.filter((p) => p.active).length ?? 0;
  const totalRevenue = (orders ?? []).reduce((s, o) => s + (o.total_amount ?? 0), 0);
  const upcomingTrips = (trips ?? []).filter((t) => new Date(t.departure_date) >= new Date()).slice(0, 3);

  const stats = [
    { label: "Pedidos", value: String(orders?.length ?? 0), icon: Package, color: "text-blue-600 bg-blue-50", to: "/admin/orders" },
    { label: "Clientes", value: String(clients?.length ?? 0), icon: Users, color: "text-emerald-600 bg-emerald-50", to: "/admin/clients" },
    { label: "Promoções Ativas", value: String(activePromos), icon: Tag, color: "text-purple-600 bg-purple-50", to: "/admin/promotions" },
    { label: "Receita Total", value: `R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-amber-600 bg-amber-50", to: "/admin/payments" },
  ];

  const ordersByStatus = KANBAN_COLS.reduce((acc, status) => {
    acc[status] = (orders ?? []).filter((o) => o.status === status);
    return acc;
  }, {} as Record<OrderStatus, OrderWithClient[]>);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                  <div className={`p-2 rounded-lg ${s.color}`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-lg font-semibold mb-4">Pedidos por Status</h2>
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
        {KANBAN_COLS.map((status) => (
          <div key={status} className="min-w-[200px] flex-shrink-0">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className={ORDER_STATUS_COLORS[status]}>{ORDER_STATUS_LABELS[status]}</Badge>
              <span className="text-xs text-muted-foreground">{ordersByStatus[status]?.length ?? 0}</span>
            </div>
            <div className="space-y-2">
              {(ordersByStatus[status] ?? []).slice(0, 5).map((o) => (
                <Link key={o.id} to={`/admin/orders/${o.id}`}>
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <p className="text-xs font-mono font-semibold">{o.order_number}</p>
                      <p className="text-xs text-muted-foreground truncate">{o.client?.full_name ?? o.customer_name}</p>
                      <p className="text-xs font-semibold mt-1">R$ {(o.total_amount ?? 0).toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {(ordersByStatus[status]?.length ?? 0) === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">—</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Plane className="h-5 w-5" /> Viagens Próximas</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTrips.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhuma viagem próxima</p>
          ) : (
            <div className="space-y-3">
              {upcomingTrips.map((t) => (
                <Link key={t.id} to="/admin/trips" className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted">
                  <div>
                    <p className="font-semibold text-sm">{t.code}</p>
                    <p className="text-xs text-muted-foreground">{t.traveler_name} — {t.flight_number}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{format(new Date(t.departure_date), "dd/MM/yyyy")}</p>
                    <p>{t.allocated_weight_kg.toFixed(1)} / {t.max_weight_kg} kg</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
