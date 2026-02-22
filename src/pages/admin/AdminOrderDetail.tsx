import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Clock, DollarSign, Package, Plane, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageSkeleton } from "@/components/shared/LoadingSkeleton";
import { useOrder, useOrderItems, useOrderEvents, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useOrderPayments, useCreatePayment } from "@/hooks/usePayments";
import { useTrips, useAllocateOrder } from "@/hooks/useTrips";
import { useSettings } from "@/hooks/useSettings";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/types";
import type { OrderStatus } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "sonner";

const ALL_STATUSES: OrderStatus[] = ["novo", "orcamento", "aprovado", "comprando", "comprado", "em_transito", "chegou_brasil", "entregue", "cancelado"];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id ?? "");
  const { data: items } = useOrderItems(id ?? "");
  const { data: events } = useOrderEvents(id ?? "");
  const { data: payments } = useOrderPayments(id ?? "");
  const { data: trips } = useTrips();
  const { data: settings } = useSettings();
  const updateStatus = useUpdateOrderStatus();
  const createPayment = useCreatePayment();
  const allocateOrder = useAllocateOrder();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payType, setPayType] = useState<"deposit" | "balance" | "refund">("deposit");
  const [payAmount, setPayAmount] = useState("");
  const [tripOpen, setTripOpen] = useState(false);

  if (isLoading || !order) return <PageSkeleton />;

  const totalPaid = (payments ?? []).filter((p) => p.type !== "refund").reduce((s, p) => s + p.amount, 0);
  const remaining = (order.total_amount ?? 0) - totalPaid;
  const whatsappNumber = settings?.whatsapp_number ?? "5561999999999";

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate({
      orderId: order.id,
      status: newStatus as OrderStatus,
      title: ORDER_STATUS_LABELS[newStatus as OrderStatus],
    });
  };

  const handlePayment = () => {
    if (!payAmount || Number(payAmount) <= 0) { toast.error("Valor inválido"); return; }
    createPayment.mutate({ order_id: order.id, type: payType, amount: Number(payAmount) }, {
      onSuccess: () => { setPaymentOpen(false); setPayAmount(""); },
    });
  };

  const handleAllocate = (tripId: string) => {
    allocateOrder.mutate({ orderId: order.id, tripId }, { onSuccess: () => setTripOpen(false) });
  };

  return (
    <div>
      <Link to="/admin/orders" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Voltar para Pedidos
      </Link>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold">{order.order_number}</h1>
        <Badge variant="outline" className={ORDER_STATUS_COLORS[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Package className="h-5 w-5" /> Itens</CardTitle></CardHeader>
            <CardContent>
              {(items ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">{order.items || "Nenhum item"}</p>
              ) : (
                <div className="space-y-3">
                  {(items ?? []).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      {item.product_image_url && <img src={item.product_image_url} alt={item.product_name} className="h-12 w-12 rounded object-cover" />}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.product_name}</p>
                        {item.store && <p className="text-xs text-muted-foreground">{item.store}</p>}
                      </div>
                      <div className="text-right text-sm">
                        <p>US$ {item.price_usd.toFixed(2)}</p>
                        <p className="text-muted-foreground">R$ {item.price_brl.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financeiro */}
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><DollarSign className="h-5 w-5" /> Financeiro</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total USD</span><span className="font-semibold">US$ {(order.total_usd ?? 0).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total BRL</span><span className="font-semibold">R$ {(order.total_amount ?? 0).toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total Pago</span><span className="font-semibold text-emerald-600">R$ {totalPaid.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Saldo Restante</span><span className="font-semibold text-amber-600">R$ {remaining.toFixed(2)}</span></div>
              <Separator />
              {(payments ?? []).map((p) => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="capitalize">{p.type === "deposit" ? "Sinal" : p.type === "balance" ? "Saldo" : "Reembolso"}</span>
                  <span className={p.type === "refund" ? "text-red-600" : "text-emerald-600"}>
                    {p.type === "refund" ? "-" : "+"}R$ {p.amount.toFixed(2)}
                  </span>
                </div>
              ))}

              <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-2">Registrar Pagamento</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Registrar Pagamento</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Tipo</Label>
                      <Select value={payType} onValueChange={(v) => setPayType(v as typeof payType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deposit">Sinal</SelectItem>
                          <SelectItem value="balance">Saldo</SelectItem>
                          <SelectItem value="refund">Reembolso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="0.00" />
                    </div>
                    <Button onClick={handlePayment} className="w-full" disabled={createPayment.isPending}>
                      {createPayment.isPending ? "Salvando..." : "Confirmar"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5" /> Timeline</CardTitle></CardHeader>
            <CardContent>
              {(events ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum evento ainda.</p>
              ) : (
                <div className="space-y-4">
                  {(events ?? []).map((ev) => (
                    <div key={ev.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <div className="w-px flex-1 bg-border" />
                      </div>
                      <div className="pb-4">
                        <p className="font-semibold text-sm">{ev.title}</p>
                        {ev.description && <p className="text-xs text-muted-foreground">{ev.description}</p>}
                        {ev.photo_url && <img src={ev.photo_url} alt="" className="mt-2 h-32 rounded-lg object-cover" />}
                        <p className="text-xs text-muted-foreground mt-1">{format(new Date(ev.created_at), "dd/MM/yy HH:mm")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Alterar Status</CardTitle></CardHeader>
            <CardContent>
              <Select value={order.status} onValueChange={handleStatusChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{ORDER_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Cliente */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Cliente</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-semibold">{order.customer_name}</p>
              {order.customer_phone && <p className="text-muted-foreground">{order.customer_phone}</p>}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Sobre o pedido ${order.order_number}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 hover:underline mt-2"
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </a>
            </CardContent>
          </Card>

          {/* Viagem */}
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plane className="h-4 w-4" /> Viagem</CardTitle></CardHeader>
            <CardContent>
              {order.trip_id ? (
                <p className="text-sm font-semibold">Alocado</p>
              ) : (
                <Dialog open={tripOpen} onOpenChange={setTripOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">Atribuir a Viagem</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Selecionar Viagem</DialogTitle></DialogHeader>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {(trips ?? []).map((t) => (
                        <button key={t.id} onClick={() => handleAllocate(t.id)} className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted text-left">
                          <div>
                            <p className="font-semibold text-sm">{t.code}</p>
                            <p className="text-xs text-muted-foreground">{t.traveler_name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{format(new Date(t.departure_date), "dd/MM")}</p>
                        </button>
                      ))}
                      {(trips ?? []).length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhuma viagem</p>}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Info</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Peso est.: {order.estimated_weight_kg ?? 0.5} kg</p>
              <p>Criado: {format(new Date(order.created_at), "dd/MM/yy HH:mm")}</p>
              {order.notes && <p>Notas: {order.notes}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
