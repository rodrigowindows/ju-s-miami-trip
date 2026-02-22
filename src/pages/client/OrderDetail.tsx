import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Order, OrderItem, OrderEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, MessageCircle, Calendar, Check, Clock, Package, Truck, MapPin, CreditCard, ShoppingBag, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  novo: { label: "Novo", color: "bg-gray-100 text-gray-700" },
  orcamento: { label: "Orçamento", color: "bg-yellow-100 text-yellow-800" },
  aprovado: { label: "Aprovado", color: "bg-green-100 text-green-700" },
  comprando: { label: "Comprando", color: "bg-blue-100 text-blue-700" },
  comprado: { label: "Comprado", color: "bg-blue-100 text-blue-700" },
  em_transito: { label: "Em trânsito", color: "bg-purple-100 text-purple-700" },
  chegou_brasil: { label: "Chegou ao Brasil", color: "bg-indigo-100 text-indigo-700" },
  entregue: { label: "Entregue", color: "bg-green-100 text-green-700" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-700" },
};

const TIMELINE_STEPS = [
  { status: "novo", title: "Pedido criado", icon: FileText },
  { status: "orcamento", title: "Orçamento enviado", icon: CreditCard },
  { status: "aprovado", title: "Pagamento aprovado", icon: Check },
  { status: "comprando", title: "Comprando nos EUA", icon: ShoppingBag },
  { status: "comprado", title: "Produto comprado", icon: Package },
  { status: "em_transito", title: "Em trânsito", icon: Truck },
  { status: "chegou_brasil", title: "Chegou ao Brasil", icon: MapPin },
  { status: "entregue", title: "Entregue", icon: Check },
];

const STATUS_ORDER = [
  "novo", "orcamento", "aprovado", "comprando", "comprado", "em_transito", "chegou_brasil", "entregue",
];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [schedulePeriod, setSchedulePeriod] = useState<"manha" | "tarde" | "noite">("manha");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [whatsappPhone, setWhatsappPhone] = useState("5561999999999");

  useEffect(() => {
    if (!id || !user) return;
    async function fetch() {
      const [orderRes, itemsRes, eventsRes, settingsRes] = await Promise.all([
        supabase.from("orders").select("*").eq("id", id!).single(),
        supabase.from("order_items").select("*").eq("order_id", id!),
        supabase.from("order_events").select("*").eq("order_id", id!).order("created_at", { ascending: true }),
        supabase.from("settings").select("key, value").eq("key", "whatsapp_phone"),
      ]);
      setOrder(orderRes.data as Order | null);
      setItems((itemsRes.data as OrderItem[]) ?? []);
      setEvents((eventsRes.data as OrderEvent[]) ?? []);

      const phoneSettings = (settingsRes.data as { key: string; value: string }[]) ?? [];
      if (phoneSettings.length > 0) {
        setWhatsappPhone(phoneSettings[0].value);
      }

      setLoading(false);
    }
    fetch();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Pedido não encontrado</p>
        <Button variant="outline" onClick={() => navigate("/client/orders")}>Voltar</Button>
      </div>
    );
  }

  const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.novo;
  const currentStepIndex = STATUS_ORDER.indexOf(order.status);
  const productImages = items.map((i) => i.product_image_url).filter(Boolean) as string[];

  // Match events by event_type field
  function getEventForStatus(status: string) {
    return events.find((e) => e.event_type === status);
  }

  async function handleScheduleDelivery() {
    if (!scheduleDate) return;
    const periodLabels = { manha: "manhã", tarde: "tarde", noite: "noite" };

    await supabase.from("order_events").insert({
      order_id: order!.id,
      event_type: "chegou_brasil",
      title: "Entrega agendada",
      description: `Data: ${new Date(scheduleDate).toLocaleDateString("pt-BR")} - Turno: ${periodLabels[schedulePeriod]}`,
    });

    toast({
      title: "Entrega agendada!",
      description: `Agendado para ${new Date(scheduleDate).toLocaleDateString("pt-BR")} no turno da ${periodLabels[schedulePeriod]}.`,
    });
    setShowSchedule(false);
  }

  const whatsappText = encodeURIComponent(
    `Oi! Tenho uma dúvida sobre o pedido ${order.order_number}`
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/client/orders")} className="p-1 -ml-1 text-foreground">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold">{order.order_number}</h1>
        </div>
        <Badge className={`${config.color} text-[10px] font-semibold border-0 rounded-full px-2.5`}>
          {config.label}
        </Badge>
      </header>

      <main className="px-4 pt-4 pb-24 space-y-6">
        {/* Product Photos */}
        {productImages.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">Produtos</h2>
            <div className="relative">
              <div className="overflow-hidden rounded-xl">
                <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${photoIndex * 100}%)` }}>
                  {productImages.map((url, i) => (
                    <div key={i} className="w-full shrink-0 aspect-video bg-muted rounded-xl overflow-hidden">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              {productImages.length > 1 && (
                <>
                  <button onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))} disabled={photoIndex === 0} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow disabled:opacity-30">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setPhotoIndex(Math.min(productImages.length - 1, photoIndex + 1))} disabled={photoIndex === productImages.length - 1} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow disabled:opacity-30">
                    <ChevronRight size={16} />
                  </button>
                  <div className="flex justify-center gap-1.5 mt-2">
                    {productImages.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === photoIndex ? "bg-violet-600" : "bg-muted-foreground/30"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Items list */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">Itens do pedido</h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-border p-3 flex items-center gap-3">
                {item.product_image_url && (
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img src={item.product_image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.product_name}</p>
                  <div className="flex gap-3 mt-0.5">
                    {item.price_usd != null && <span className="text-xs text-muted-foreground">US$ {item.price_usd.toFixed(2)}</span>}
                    {item.price_brl != null && <span className="text-xs font-semibold text-violet-600">R$ {item.price_brl.toFixed(2).replace(".", ",")}</span>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">Qtd: {item.quantity}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">Acompanhamento</h2>
          <div className="space-y-0">
            {TIMELINE_STEPS.map((step, index) => {
              const event = getEventForStatus(step.status);
              const isDone = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isLast = index === TIMELINE_STEPS.length - 1;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? (isCurrent ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-600") : "bg-muted text-muted-foreground"}`}>
                      <Icon size={14} />
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 min-h-[24px] ${isDone && index < currentStepIndex ? "bg-violet-200" : "bg-muted"}`} />}
                  </div>
                  <div className={`pb-4 ${!isDone ? "opacity-40" : ""}`}>
                    <p className={`text-sm font-medium ${isCurrent ? "text-violet-700" : "text-foreground"}`}>{step.title}</p>
                    {event && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(event.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                    {event?.description && <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>}
                    {event?.photo_url && (
                      <a href={event.photo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-0.5 block">
                        Ver foto
                      </a>
                    )}
                    {isDone && isCurrent && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={10} className="text-violet-600" />
                        <span className="text-[10px] text-violet-600 font-medium">Etapa atual</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment section */}
        {(order.total_brl || order.total_usd) && (
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3">Pagamento</h2>
            <div className="bg-white rounded-xl border border-border p-4 space-y-2">
              {order.total_usd != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total USD</span>
                  <span className="font-medium">US$ {order.total_usd.toFixed(2)}</span>
                </div>
              )}
              {order.total_brl != null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total BRL</span>
                  <span className="font-bold text-violet-600">R$ {order.total_brl.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              {order.deposit_paid > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sinal pago</span>
                  <span className="font-medium text-green-600">R$ {order.deposit_paid.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full gap-2">
            <a href={`https://wa.me/${whatsappPhone}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          </Button>

          {order.status === "chegou_brasil" && (
            <Button onClick={() => setShowSchedule(true)} variant="outline" className="w-full rounded-full gap-2 border-violet-200 text-violet-700 hover:bg-violet-50">
              <Calendar size={16} /> Agendar entrega
            </Button>
          )}
        </div>
      </main>

      {/* Schedule Delivery Modal */}
      <Dialog open={showSchedule} onOpenChange={setShowSchedule}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Agendar entrega</DialogTitle>
            <p className="text-xs text-muted-foreground">Escolha a data e turno para receber seu pedido</p>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Turno</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: "manha", label: "Manhã", time: "8h-12h" },
                  { key: "tarde", label: "Tarde", time: "13h-17h" },
                  { key: "noite", label: "Noite", time: "18h-21h" },
                ] as const).map((period) => (
                  <button key={period.key} onClick={() => setSchedulePeriod(period.key)} className={`p-3 rounded-xl border text-center transition-colors ${schedulePeriod === period.key ? "border-violet-600 bg-violet-50 text-violet-700" : "border-border text-muted-foreground hover:border-violet-200"}`}>
                    <p className="text-sm font-medium">{period.label}</p>
                    <p className="text-[10px]">{period.time}</p>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleScheduleDelivery} disabled={!scheduleDate} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full">
              Confirmar agendamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
