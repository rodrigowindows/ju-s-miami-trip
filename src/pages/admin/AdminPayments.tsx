import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { usePayments } from "@/hooks/usePayments";
import { format } from "date-fns";

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  deposit: { label: "Sinal", color: "bg-blue-100 text-blue-700 border-blue-200" },
  balance: { label: "Saldo", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  refund: { label: "Reembolso", color: "bg-red-100 text-red-700 border-red-200" },
};

export default function AdminPayments() {
  const { data: payments, isLoading } = usePayments();

  const totalReceived = (payments ?? []).filter((p) => p.type !== "refund").reduce((s, p) => s + p.amount, 0);
  const totalRefunded = (payments ?? []).filter((p) => p.type === "refund").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Pagamentos</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Total Recebido</p>
            <p className="text-2xl font-bold text-emerald-600">R$ {totalReceived.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Reembolsos</p>
            <p className="text-2xl font-bold text-red-600">R$ {totalRefunded.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton rows={5} cols={5} /></div>
          ) : (payments ?? []).length === 0 ? (
            <EmptyState icon="wallet" title="Nenhum pagamento" description="Pagamentos registrados aparecerão aqui." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(payments ?? []).map((p) => {
                  const t = TYPE_LABELS[p.type] ?? { label: p.type, color: "" };
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Link to={`/admin/orders/${p.order_id}`} className="font-mono text-primary hover:underline">
                          {p.order?.order_number ?? "—"}
                        </Link>
                      </TableCell>
                      <TableCell>{p.order?.client_name ?? "—"}</TableCell>
                      <TableCell><Badge variant="outline" className={t.color}>{t.label}</Badge></TableCell>
                      <TableCell className={`font-semibold ${p.type === "refund" ? "text-red-600" : "text-emerald-600"}`}>
                        {p.type === "refund" ? "-" : "+"}R$ {p.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{format(new Date(p.created_at), "dd/MM/yy")}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
