import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Truck } from "lucide-react";
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
import { useOrder, useOrderItems, useOrderEvents, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useOrderPayments, useCreatePayment } from "@/hooks/usePayments";
import { useTrips, useAllocateOrder } from "@/hooks/useTrips";
import { useToast } from "@/hooks/use-toast";

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

const STATUS_FLOW = [
  { value: "novo", label: "Novo" },
  { value: "orcamento", label: "Orçamento" },
  { value: "aprovado", label: "Aprovado" },
  { value: "comprando", label: "Comprando" },
  { value: "comprado", label: "Comprado" },
  { value: "em_transito", label: "Em trânsito" },
  { value: "chegou_brasil", label: "Chegou ao Brasil" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
];

const typeLabels: Record<string, string> = {
  deposit: "Depósito Sinal",
  balance: "Pagamento Saldo",
  refund: "Reembolso",
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: order, isLoading: orderLoading } = useOrder(id!);
  const { data: items } = useOrderItems(id!);
  const { data: events } = useOrderEvents(id!);
  const { data: payments, isLoading: paymentsLoading } = useOrderPayments(id!);
  const { data: trips } = useTrips();
  const createPayment = useCreatePayment();
  const updateStatus = useUpdateOrderStatus();
  const allocateOrder = useAllocateOrder();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [tripOpen, setTripOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
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
        <p className="text-muted-foreground">Pedido não encontrado.</p>
        <Button variant="link" onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  const totalPaid = payments?.reduce((sum, p) => {
    if (p.type === "refund") return sum - p.amount;
    return sum + p.amount;
  }, 0) ?? 0;

  const totalBrl = order.total_brl ?? 0;
  const remaining = totalBrl - totalPaid;
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.novo;

  const handleChangeStatus = async () => {
    if (!newStatus) return;
    const statusLabel = STATUS_FLOW.find((s) => s.value === newStatus)?.label ?? newStatus;
    try {
      await updateStatus.mutateAsync({
        orderId: order.id,
        status: newStatus,
        title: `Status alterado para ${statusLabel}`,
      });
      toast({ title: "Status atualizado!" });
      setStatusOpen(false);
    } catch {
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    }
  };

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
      setPaymentForm({ type: "deposit", amount: "", receipt_url: "", notes: "" });
    } catch {
      toast({ title: "Erro ao registrar pagamento", variant: "destructive" });
    }
  };

  const handleAllocateTrip = async (tripId: string) => {
    try {
      await allocateOrder.mutateAsync({ orderId: order.id, tripId });
      toast({ title: "Pedido alocado à viagem!" });
      setTripOpen(false);
    } catch {
      toast({ title: "Erro ao alocar", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Voltar
      </Button>

      {/* Order info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-xl">Pedido {order.order_number}</CardTitle>
            <div className="flex gap-2">
              <Badge className={`${cfg.color} border-0`}>{cfg.label}</Badge>
              <Button size="sm" variant="outline" onClick={() => { setNewStatus(order.status); setStatusOpen(true); }}>
                Alterar Status
              </Button>
              {!order.trip_id && (
                <Button size="sm" variant="outline" className="gap-1" onClick={() => setTripOpen(true)}>
                  <Truck size={14} /> Atribuir Viagem
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">Cliente</span>
              <span className="font-medium">{order.client?.full_name ?? "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Telefone</span>
              <span className="font-medium">{order.client?.phone ?? "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Email</span>
              <span className="font-medium">{order.client?.email ?? "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Total BRL</span>
              <span className="font-medium">
                {totalBrl > 0 ? `R$ ${totalBrl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Peso Est.</span>
              <span className="font-medium">
                {order.estimated_weight_kg ? `${order.estimated_weight_kg} kg` : "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Criado em</span>
              <span className="font-medium">
                {format(new Date(order.created_at), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      {items && items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead className="text-right">USD</TableHead>
                  <TableHead className="text-right">BRL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-sm">{item.product_name}</TableCell>
                    <TableCell className="text-sm">{item.quantity}</TableCell>
                    <TableCell className="text-right text-sm">
                      {item.price_usd ? `US$ ${item.price_usd.toFixed(2)}` : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {item.price_brl ? `R$ ${item.price_brl.toFixed(2)}` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {events && events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    {event.description && (
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    )}
                    
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {format(new Date(event.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pagamentos</CardTitle>
            <Button size="sm" className="gap-2" onClick={() => setPaymentOpen(true)}>
              <Plus size={14} /> Registrar Pagamento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">Total</span>
              <span className="font-bold text-sm">
                R$ {totalBrl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">Pago</span>
              <span className="font-bold text-sm text-green-600">
                R$ {totalPaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xs text-muted-foreground block">Restante</span>
              <span className={`font-bold text-sm ${remaining > 0 ? "text-orange-500" : "text-green-600"}`}>
                R$ {remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

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
                      {format(new Date(p.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.type === "refund" ? "destructive" : "secondary"}>
                        {typeLabels[p.type] ?? p.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {p.type === "refund" ? "- " : ""}R$ {p.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.notes ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum pagamento registrado.</p>
          )}
        </CardContent>
      </Card>

      {/* Change status dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status</DialogTitle>
            <DialogDescription>Selecione o novo status do pedido</DialogDescription>
          </DialogHeader>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_FLOW.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusOpen(false)}>Cancelar</Button>
            <Button onClick={handleChangeStatus} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate trip dialog */}
      <Dialog open={tripOpen} onOpenChange={setTripOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir a Viagem</DialogTitle>
            <DialogDescription>Selecione uma viagem disponível</DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {trips && trips.length > 0 ? (
              trips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => handleAllocateTrip(trip.id)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{trip.code}</span>
                    <span className="text-xs text-muted-foreground">
                      {trip.allocated_weight_kg.toFixed(1)} / {trip.max_weight_kg} kg
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{trip.traveler_name}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhuma viagem disponível.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Register payment dialog */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>Pedido {order.order_number}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo</Label>
              <Select value={paymentForm.type} onValueChange={(v) => setPaymentForm({ ...paymentForm, type: v as "deposit" | "balance" | "refund" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="deposit">Depósito Sinal</SelectItem>
                  <SelectItem value="balance">Pagamento Saldo</SelectItem>
                  <SelectItem value="refund">Reembolso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
            </div>
            <div>
              <Label>Link do Comprovante (opcional)</Label>
              <Input value={paymentForm.receipt_url} onChange={(e) => setPaymentForm({ ...paymentForm, receipt_url: e.target.value })} />
            </div>
            <div>
              <Label>Observações (opcional)</Label>
              <Input value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreatePayment} disabled={!paymentForm.amount || createPayment.isPending}>
              {createPayment.isPending ? "Registrando..." : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetail;
