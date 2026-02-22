import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { useOrders } from "@/hooks/useOrders";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/types";
import { format } from "date-fns";

export default function AdminOrders() {
  const { data: orders, isLoading } = useOrders();
  const [search, setSearch] = useState("");

  const filtered = (orders ?? []).filter(
    (o) =>
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Pedidos</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar pedido..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton rows={5} cols={6} /></div>
          ) : filtered.length === 0 ? (
            <EmptyState icon="orders" title="Nenhum pedido" description="Os pedidos aparecerão aqui quando forem criados." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link to={`/admin/orders/${o.id}`} className="font-mono font-semibold text-primary hover:underline">
                        {o.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>{o.customer_name}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{o.items}</TableCell>
                    <TableCell className="font-semibold">R$ {(o.total_amount ?? 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={ORDER_STATUS_COLORS[o.status]}>{ORDER_STATUS_LABELS[o.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(o.created_at), "dd/MM/yy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
