import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { useOrder } from "@/hooks/useOrders";
import { useOrderPayments, useCreatePayment } from "@/hooks/usePayments";
import { useToast } from "@/hooks/use-toast";

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  purchased: "Comprado",
  in_transit: "Em Transito",
  delivered: "Entregue",
};

const typeLabels: Record<string, string> = {
  deposit: "Deposito Sinal",
  balance: "Pagamento Saldo",
  refund: "Reembolso",
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: order, isLoading: orderLoading } = useOrder(id!);
  const { data: payments, isLoading: paymentsLoading } = useOrderPayments(
    id!
  );
  const createPayment = useCreatePayment();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: "deposit" as "deposit" | "balance" | "refund",
    amount: "",
    receipt_url: "",
    notes: "",
  });

  const isLoading = orderLoading || paymentsLoading;

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto text-center">
        <p className="text-muted-foreground">Pedido nao encontrado.</p>
        <Button variant="link" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    );
  }

  const totalPaid =
    payments?.reduce((sum, p) => {
      if (p.type === "refund") return sum - p.amount;
      return sum + p.amount;
    }, 0) ?? 0;

  const remaining = order.total_amount - totalPaid;

  const handleCreatePayment = async () => {
    try {
      await createPayment.mutateAsync({
        order_id: order.id,
        type: paymentForm.type,
        amount: Number(paymentForm.amount),
        receipt_url: paymentForm.receipt_url || null,
        notes: paymentForm.notes || null,
      });
      toast({ title: "Pagamento registrado!" });
      setPaymentOpen(false);
      setPaymentForm({
        type: "deposit",
        amount: "",
        receipt_url: "",
        notes: "",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao registrar pagamento";
      toast({ title: "Erro", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} />
        Voltar
      </Button>

      {/* Order info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-body text-xl">
              Pedido {order.order_number}
            </CardTitle>
            <Badge variant="secondary">
              {statusLabels[order.status] ?? order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">Cliente</span>
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Telefone</span>
              <span className="font-medium">{order.customer_phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Itens</span>
              <span className="font-medium">{order.items}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Total</span>
              <span className="font-medium">
                R${" "}
                {order.total_amount.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Peso Est.</span>
              <span className="font-medium">
                {order.estimated_weight_kg
                  ? `${order.estimated_weight_kg} kg`
                  : "-"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Criado em</span>
              <span className="font-medium">
                {format(new Date(order.created_at), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-body text-lg">Pagamentos</CardTitle>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => setPaymentOpen(true)}
            >
              <Plus size={14} />
              Registrar Pagamento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">Total</span>
              <span className="font-bold text-sm">
                R${" "}
                {order.total_amount.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">Pago</span>
              <span className="font-bold text-sm text-green-600">
                R${" "}
                {totalPaid.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">
                Restante
              </span>
              <span
                className={`font-bold text-sm ${
                  remaining > 0 ? "text-orange-500" : "text-green-600"
                }`}
              >
                R${" "}
                {remaining.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Payment list */}
          {payments && payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">
                      {format(new Date(p.created_at), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.type === "refund" ? "destructive" : "secondary"
                        }
                      >
                        {typeLabels[p.type] ?? p.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {p.type === "refund" ? "- " : ""}R${" "}
                      {p.amount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.notes ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum pagamento registrado.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Register payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              Registre um novo pagamento para o pedido {order.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={paymentForm.type}
                onValueChange={(val) =>
                  setPaymentForm({
                    ...paymentForm,
                    type: val as "deposit" | "balance" | "refund",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">Deposito Sinal</SelectItem>
                  <SelectItem value="balance">Pagamento Saldo</SelectItem>
                  <SelectItem value="refund">Reembolso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amount: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Link do Comprovante (opcional)</Label>
              <Input
                placeholder="https://..."
                value={paymentForm.receipt_url}
                onChange={(e) =>
                  setPaymentForm({
                    ...paymentForm,
                    receipt_url: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Observacoes (opcional)</Label>
              <Input
                placeholder="Sinal via PIX..."
                value={paymentForm.notes}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreatePayment}
              disabled={!paymentForm.amount || createPayment.isPending}
            >
              {createPayment.isPending ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetail;
