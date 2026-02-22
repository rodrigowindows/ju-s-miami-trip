import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Filter, DollarSign } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
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
import { usePayments } from "@/hooks/usePayments";
import { formatBRL, formatDate } from "@/lib/format";

const Payments = () => {
  const navigate = useNavigate();
  const { data: payments, isLoading } = usePayments();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");

  const clients = useMemo(() => {
    if (!payments) return [];
    const names = [...new Set(payments.map((p) => p.order?.customer_name).filter(Boolean))];
    return names.sort() as string[];
  }, [payments]);

  const filtered = useMemo(() => {
    if (!payments) return [];
    return payments.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (clientFilter !== "all" && p.order?.customer_name !== clientFilter) return false;
      return true;
    });
  }, [payments, typeFilter, clientFilter]);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Pagamentos</h1>
          <p className="text-sm text-muted-foreground mt-1">Todas as transações financeiras</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="deposit">Depósito Sinal</SelectItem>
              <SelectItem value="balance">Pagamento Saldo</SelectItem>
              <SelectItem value="refund">Reembolso</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Cliente" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clients.map((name) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 bg-muted rounded" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <DollarSign size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Nenhum pagamento encontrado.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Data</TableHead>
                <TableHead>Pedido</TableHead>
                <TableHead className="hidden md:table-cell">Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="hidden sm:table-cell">Comprovante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-sm hidden sm:table-cell">
                    {formatDate(payment.created_at)}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => navigate(`/admin/orders/${payment.order_id}`)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {payment.order?.order_number ?? "—"}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm hidden md:table-cell">{payment.order?.customer_name ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={payment.type} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {payment.type === "refund" ? "- " : ""}{formatBRL(payment.amount)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {payment.receipt_url ? (
                      <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 text-sm">
                        <ExternalLink size={14} /> Ver
                      </a>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Payments;
