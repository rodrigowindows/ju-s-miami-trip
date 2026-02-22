import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { KANBAN_COLUMNS, type Order } from "@/types/database";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function KanbanBoard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("orders")
        .select("*, client:profiles!client_id(id, name)")
        .order("created_at", { ascending: false });
      if (data) setOrders(data as Order[]);
    }
    load();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((col) => {
        const colOrders = orders.filter((o) =>
          col.statuses.includes(o.status)
        );
        return (
          <div
            key={col.id}
            className="flex w-64 min-w-[16rem] flex-col rounded-lg border bg-muted/50"
          >
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {colOrders.length}
              </Badge>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-2 overflow-y-auto max-h-[calc(100vh-22rem)]">
              {colOrders.length === 0 && (
                <p className="p-3 text-center text-xs text-muted-foreground">
                  Nenhum pedido
                </p>
              )}
              {colOrders.map((order) => (
                <KanbanCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ order }: { order: Order }) {
  const timeAgo = formatDistanceToNow(new Date(order.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="p-3">
        <p className="font-medium text-sm leading-tight">
          {order.product_name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {(order.client as any)?.name ?? "Cliente"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">{timeAgo}</p>
      </CardContent>
    </Card>
  );
}
