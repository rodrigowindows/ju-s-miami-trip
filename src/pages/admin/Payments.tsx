import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExternalLink, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { usePayments, type PaymentWithOrder } from "@/hooks/usePayments";

const typeLabels: Record<string, string> = {
  deposit: "Deposito Sinal",
  balance: "Pagamento Saldo",
  refund: "Reembolso",
};

const typeBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
  deposit: "default",
  balance: "secondary",
  refund: "destructive",
};

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
      if (clientFilter !== "all" && p.order?.customer_name !== clientFilter)
        return false;
      return true;
    });
  }, [payments, typeFilter, clientFilter]);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Pagamentos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Todas as transacoes financeiras
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="deposit">Deposito Sinal</SelectItem>
              <SelectItem value="balance">Pagamento Saldo</SelectItem>
              <SelectItem value="refund">Reembolso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clients.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Comprovante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum pagamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm">
                      {format(new Date(payment.created_at), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          navigate(`/admin/orders/${payment.order_id}`)
                        }
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {payment.order?.order_number ?? "-"}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm">
                      {payment.order?.customer_name ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={typeBadgeVariant[payment.type] ?? "secondary"}>
                        {typeLabels[payment.type] ?? payment.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {payment.type === "refund" ? "- " : ""}
                      R${" "}
                      {payment.amount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      {payment.receipt_url ? (
                        <a
                          href={payment.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                        >
                          <ExternalLink size={14} />
                          Ver
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          -
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Payments;
