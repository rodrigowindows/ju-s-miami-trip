import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/hooks/useOrders";
import { Loader2, Filter, ShoppingBag } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  novo: { label: "Novo", color: "bg-gray-100 text-gray-700" },
  orcamento: { label: "Orçamento", color: "bg-yellow-100 text-yellow-800" },
  aprovado: { label: "Aprovado", color: "bg-green-100 text-green-700" },
  comprando: { label: "Comprando", color: "bg-blue-100 text-blue-700" },
  comprado: { label: "Comprado", color: "bg-blue-100 text-blue-700" },
  em_transito: { label: "Em trânsito", color: "bg-purple-100 text-purple-700" },
  chegou_brasil: { label: "Chegou Brasil", color: "bg-indigo-100 text-indigo-700" },
  entregue: { label: "Entregue", color: "bg-green-100 text-green-700" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

export default function OrdersList() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders();
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    if (!orders) return [];
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Pedidos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Todos os pedidos dos clientes
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Itens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Total</TableHead>
                <TableHead className="hidden lg:table-cell">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.novo;
                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <TableCell className="font-mono font-bold text-sm">
                      {order.order_number}
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.client?.full_name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate hidden md:table-cell">
                      {order.items ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${cfg.color} text-[10px] font-semibold border-0`}>
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm hidden sm:table-cell">
                      {order.total_brl
                        ? `R$ ${order.total_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                      {format(new Date(order.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
