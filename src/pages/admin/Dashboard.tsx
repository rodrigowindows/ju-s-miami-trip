import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/useOrders";
import { Loader2, ShoppingBag, DollarSign, Plane, Clock } from "lucide-react";
import type { OrderWithClient } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  novo: { label: "Novo / Orçar", color: "bg-gray-100 text-gray-700" },
  orcamento: { label: "Orçamento", color: "bg-yellow-100 text-yellow-800" },
  aprovado: { label: "Aprovado", color: "bg-green-100 text-green-700" },
  comprando: { label: "Comprando", color: "bg-blue-100 text-blue-700" },
  comprado: { label: "Comprado", color: "bg-blue-100 text-blue-700" },
  em_transito: { label: "Em trânsito", color: "bg-purple-100 text-purple-700" },
  chegou_brasil: { label: "Chegou ao Brasil", color: "bg-indigo-100 text-indigo-700" },
  entregue: { label: "Entregue", color: "bg-green-100 text-green-700" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

const KANBAN_COLUMNS = [
  { key: "novo", title: "Novo / Orçar" },
  { key: "orcamento", title: "Orçamento" },
  { key: "aprovado", title: "Aprovado" },
  { key: "comprando", title: "Comprando" },
  { key: "comprado", title: "Comprado" },
  { key: "em_transito", title: "Em Trânsito" },
  { key: "chegou_brasil", title: "Chegou Brasil" },
];

export default function Dashboard() {
  const { data: orders, isLoading } = useOrders();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    if (!orders) return { total: 0, active: 0, revenue: 0, pending: 0 };
    const active = orders.filter((o) => !["entregue", "cancelado"].includes(o.status)).length;
    const revenue = orders.reduce((sum, o) => sum + (o.total_brl ?? 0), 0);
    const pending = orders.filter((o) => o.status === "novo").length;
    return { total: orders.length, active, revenue, pending };
  }, [orders]);

  const columns = useMemo(() => {
    if (!orders) return {};
    const grouped: Record<string, OrderWithClient[]> = {};
    for (const col of KANBAN_COLUMNS) {
      grouped[col.key] = orders.filter((o) => o.status === col.key);
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
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral do MalaBridge
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShoppingBag size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total pedidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Clock size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <DollarSign size={20} className="text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  R$ {stats.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground">Receita total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Plane size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Para orçar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban */}
      <div>
        <h2 className="font-display text-lg font-bold mb-4">Kanban de Pedidos</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const colOrders = columns[col.key] ?? [];
            return (
              <div key={col.key} className="min-w-[240px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold">{col.title}</h3>
                  <span className="text-xs bg-muted rounded-full px-2 py-0.5 font-medium">
                    {colOrders.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colOrders.length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <p className="text-xs text-muted-foreground">Nenhum pedido</p>
                    </div>
                  ) : (
                    colOrders.map((order) => (
                      <Card
                        key={order.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold">
                              {order.order_number}
                            </span>
                            <Badge className={`${STATUS_CONFIG[order.status]?.color ?? ""} text-[10px] border-0`}>
                              {STATUS_CONFIG[order.status]?.label ?? order.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium truncate">
                            {order.client?.full_name ?? "Cliente"}
                          </p>
                          {order.items && (
                            <p className="text-xs text-muted-foreground truncate">
                              {order.items}
                            </p>
                          )}
                          {order.total_brl && (
                            <p className="text-xs font-semibold text-violet-600">
                              R$ {order.total_brl.toFixed(2).replace(".", ",")}
                            </p>
                          )}
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
