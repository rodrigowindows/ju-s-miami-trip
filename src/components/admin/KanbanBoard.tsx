import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { KANBAN_COLUMNS, type OrderStatus } from '@/types';
import { formatRelativeTime } from '@/lib/format';

interface KanbanOrder {
  id: string;
  status: OrderStatus;
  created_at: string;
  order_number: string;
  customer_name: string;
  items: string;
}

export default function KanbanBoard() {
  const [orders, setOrders] = useState<KanbanOrder[]>([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('orders')
        .select('id, status, created_at, order_number, customer_name, items')
        .neq('status', 'cancelado')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Erro ao carregar pedidos:', error.message);
        return;
      }
      setOrders((data ?? []) as KanbanOrder[]);
    }
    load();

    const channel = supabase
      .channel('orders-kanban')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
      {KANBAN_COLUMNS.map((col) => {
        const colOrders = orders.filter((o) =>
          col.statuses.includes(o.status)
        );
        return (
          <div
            key={col.id}
            className="flex w-56 min-w-[14rem] sm:w-64 sm:min-w-[16rem] flex-col rounded-lg border bg-muted/50 snap-start"
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

function KanbanCard({ order }: { order: KanbanOrder }) {
  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="p-3">
        <p className="font-medium text-sm leading-tight">
          {order.items || order.order_number}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {order.customer_name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          {formatRelativeTime(order.created_at)}
        </p>
      </CardContent>
    </Card>
  );
}
