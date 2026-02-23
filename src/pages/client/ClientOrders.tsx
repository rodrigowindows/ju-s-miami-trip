import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Package, ChevronDown, ChevronUp, Truck, CheckCircle2, Clock, ShoppingCart, CreditCard, Plane, MapPin, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useClientOrders } from "@/hooks/useOrders";
import { useOrderEvents, type OrderEvent } from "@/hooks/useOrders";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { formatBRL, formatDateTime, formatShortDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";

// Order of statuses for progress tracking
const STATUS_PIPELINE: OrderStatus[] = [
  "novo",
  "orcamento",
  "aprovado",
  "comprando",
  "comprado",
  "em_transito",
  "chegou_brasil",
  "entregue",
];

const STATUS_ICONS: Record<string, typeof Package> = {
  novo: ShoppingCart,
  orcamento: CreditCard,
  aprovado: CheckCircle2,
  comprando: ShoppingCart,
  comprado: Package,
  em_transito: Plane,
  chegou_brasil: MapPin,
  entregue: CheckCircle2,
  cancelado: XCircle,
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  novo: "Seu pedido foi recebido",
  orcamento: "Estamos calculando o valor",
  aprovado: "Pagamento confirmado",
  comprando: "Comprando nos EUA",
  comprado: "Produto comprado com sucesso",
  em_transito: "A caminho do Brasil",
  chegou_brasil: "Chegou! Preparando entrega",
  entregue: "Pedido entregue",
  cancelado: "Pedido cancelado",
};

function getStatusStep(status: string): number {
  const idx = STATUS_PIPELINE.indexOf(status as OrderStatus);
  return idx >= 0 ? idx : -1;
}

function OrderTracker({ order }: { order: Order }) {
  const currentStep = getStatusStep(order.status);
  const isCancelled = order.status === "cancelado";

  // Simplified pipeline for visual tracker (5 key steps)
  const VISUAL_STEPS = [
    { statuses: ["novo", "orcamento"], label: "Pedido", icon: ShoppingCart },
    { statuses: ["aprovado", "comprando"], label: "Comprando", icon: ShoppingCart },
    { statuses: ["comprado"], label: "Comprado", icon: Package },
    { statuses: ["em_transito"], label: "Em Transito", icon: Plane },
    { statuses: ["chegou_brasil", "entregue"], label: "Entregue", icon: CheckCircle2 },
  ];

  return (
    <div className="py-2">
      {isCancelled ? (
        <div className="flex items-center gap-2 bg-red-50 rounded-lg p-3">
          <XCircle size={18} className="text-red-500" />
          <span className="text-sm font-medium text-red-700">Pedido cancelado</span>
        </div>
      ) : (
        <div className="flex items-center gap-0">
          {VISUAL_STEPS.map((step, i) => {
            const isActive = step.statuses.includes(order.status);
            const isPast = currentStep > Math.max(...step.statuses.map((s) => getStatusStep(s)));
            const Icon = step.icon;

            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                {/* Step dot */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isActive
                        ? "bg-violet-600 text-white ring-4 ring-violet-100"
                        : isPast
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isPast ? <CheckCircle2 size={16} /> : <Icon size={14} />}
                  </div>
                  <span
                    className={`text-[9px] font-medium text-center leading-tight w-14 ${
                      isActive ? "text-violet-700" : isPast ? "text-green-700" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {/* Connector line */}
                {i < VISUAL_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 rounded-full ${
                      isPast ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EventTimeline({ orderId }: { orderId: string }) {
  const { data: events, isLoading } = useOrderEvents(orderId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
        <Clock size={12} className="animate-spin" />
        Carregando historico...
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <p className="text-xs text-muted-foreground py-2">Nenhum evento registrado ainda.</p>
    );
  }

  return (
    <div className="relative pl-4 space-y-3 py-2">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-gray-200" />

      {[...events].reverse().map((event, i) => {
        const Icon = STATUS_ICONS[event.status] ?? Clock;
        const isFirst = i === 0;

        return (
          <div key={event.id} className="flex items-start gap-3 relative">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 -ml-4 ${
                isFirst
                  ? "bg-violet-600 text-white"
                  : "bg-white border-2 border-gray-300 text-gray-400"
              }`}
            >
              <Icon size={8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-xs font-semibold ${isFirst ? "text-violet-700" : "text-gray-700"}`}>
                  {event.title}
                </p>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatDateTime(event.created_at)}
                </span>
              </div>
              {event.description && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{event.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, whatsappNumber }: { order: Order; whatsappNumber: string }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = STATUS_ICONS[order.status] ?? Package;

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-4 pb-3 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
              <Icon size={16} />
            </div>
            <div>
              <p className="font-mono font-semibold text-sm">{order.order_number}</p>
              <p className="text-[10px] text-muted-foreground">{formatShortDate(order.created_at)}</p>
            </div>
          </div>
          <Badge variant="outline" className={ORDER_STATUS_COLORS[order.status]}>
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </Badge>
        </div>

        {/* Product info */}
        <div className="flex items-center gap-3">
          {order.product_image_url && (
            <img
              src={order.product_image_url}
              alt={order.items}
              className="w-12 h-12 rounded-lg object-cover border"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground line-clamp-1">{order.items}</p>
            <p className="text-sm font-bold text-violet-600 mt-0.5">{formatBRL(order.total_amount ?? 0)}</p>
          </div>
        </div>

        {/* Status tracker */}
        <OrderTracker order={order} />

        {/* Current status description */}
        <div className="bg-muted/50 rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <p className="text-xs text-muted-foreground">
            {STATUS_DESCRIPTIONS[order.status] ?? "Processando..."}
          </p>
        </div>

        {/* Expand/collapse for timeline */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-violet-600 font-medium hover:text-violet-800 transition-colors w-full justify-center py-1"
        >
          {expanded ? (
            <>
              <ChevronUp size={14} />
              Ocultar historico
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              Ver historico completo
            </>
          )}
        </button>

        {/* Timeline (collapsed by default) */}
        {expanded && (
          <div className="border-t pt-2">
            <EventTimeline orderId={order.id} />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Ola! Gostaria de saber sobre o pedido ${order.order_number}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full text-emerald-600">
              <MessageSquare className="h-4 w-4 mr-1" /> WhatsApp
            </Button>
          </a>
          {order.status === "chegou_brasil" && (
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Ola! Gostaria de agendar a entrega do pedido ${order.order_number}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1"
            >
              <Button size="sm" className="w-full">
                <Truck className="h-4 w-4 mr-1" /> Agendar Entrega
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ClientOrders() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useClientOrders(user?.id ?? "");
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.whatsapp_number ?? "5561999999999";

  const activeOrders = (orders ?? []).filter((o) => !["entregue", "cancelado"].includes(o.status));
  const pastOrders = (orders ?? []).filter((o) => ["entregue", "cancelado"].includes(o.status));

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Package size={22} className="text-violet-600" />
        <h2 className="font-display text-xl font-bold">Meus Pedidos</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
      ) : (orders ?? []).length === 0 ? (
        <EmptyState icon="orders" title="Nenhum pedido ainda" description="Visite a Vitrine para fazer seu primeiro pedido!">
          <Link to="/client/catalog">
            <Button className="mt-2">Ver Vitrine</Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="space-y-6">
          {/* Active orders */}
          {activeOrders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <h3 className="text-sm font-semibold text-foreground">
                  Em andamento ({activeOrders.length})
                </h3>
              </div>
              <div className="space-y-3">
                {activeOrders.map((o) => (
                  <OrderCard key={o.id} order={o} whatsappNumber={whatsappNumber} />
                ))}
              </div>
            </div>
          )}

          {/* Past orders */}
          {pastOrders.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Anteriores ({pastOrders.length})
              </h3>
              <div className="space-y-3">
                {pastOrders.map((o) => (
                  <OrderCard key={o.id} order={o} whatsappNumber={whatsappNumber} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
