import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import { KANBAN_COLUMNS } from "@/types";
import { formatBRL } from "@/lib/format";
import type { OrderWithClient } from "@/types";

interface DashboardKanbanProps {
  orders: OrderWithClient[];
}

export default function DashboardKanban({ orders }: DashboardKanbanProps) {
  const navigate = useNavigate();

  const columns: Record<string, OrderWithClient[]> = {};
  for (const col of KANBAN_COLUMNS) {
    columns[col.id] = orders.filter((o) => col.statuses.includes(o.status as typeof col.statuses[number]));
  }

  return (
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
                    <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/pedidos/${order.id}`)}>
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
  );
}
