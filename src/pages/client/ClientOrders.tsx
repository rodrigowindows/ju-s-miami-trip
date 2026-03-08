import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Package,
  Plane,
  ShoppingCart,
  CheckCircle2,
  Truck,
  ChevronRight,
  MapPin,
  Clock,
  XCircle,
  Receipt,
  CircleDollarSign,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import ReviewDialog from "@/components/client/ReviewDialog";
import { useClientOrders } from "@/hooks/useOrders";
import { useClientOrderReviews } from "@/hooks/useOrderReviews";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { formatBRL, formatDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";

const STATUS_FLOW: OrderStatus[] = [
  "novo", "orcamento", "aprovado", "comprando", "comprado",
  "em_transito", "chegou_brasil", "entregue",
];

const STATUS_DISPLAY: Record<string, { label: string; icon: typeof Package; color: string; bg: string }> = {
  novo: { label: "Pedido Recebido", icon: Receipt, color: "text-gray-600", bg: "bg-gray-50" },
  orcamento: { label: "Orçamento Enviado", icon: CircleDollarSign, color: "text-amber-600", bg: "bg-amber-50" },
  aprovado: { label: "Aprovado", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  comprando: { label: "Comprando", icon: ShoppingCart, color: "text-orange-600", bg: "bg-orange-50" },
  comprado: { label: "Comprado", icon: Package, color: "text-teal-600", bg: "bg-teal-50" },
  em_transito: { label: "Em Trânsito", icon: Plane, color: "text-purple-600", bg: "bg-purple-50" },
  chegou_brasil: { label: "No Brasil", icon: MapPin, color: "text-green-600", bg: "bg-green-50" },
  entregue: { label: "Entregue", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  cancelado: { label: "Cancelado", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

function MiniProgress({ status }: { status: string }) {
  if (status === "cancelado") return null;
  const idx = STATUS_FLOW.indexOf(status as OrderStatus);
  const pct = Math.max(5, (idx / (STATUS_FLOW.length - 1)) * 100);
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          status === "entregue" ? "bg-emerald-500" : "bg-[#007600]"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function getEstimate(order: Order) {
  if (order.status === "entregue" || order.status === "cancelado") return null;
  const created = new Date(order.created_at);
  const statusIdx = STATUS_FLOW.indexOf(order.status as OrderStatus);
  const minDays = statusIdx >= 5 ? 2 : statusIdx >= 4 ? 7 : 15;
  const maxDays = statusIdx >= 5 ? 5 : statusIdx >= 4 ? 14 : 25;
  const minDate = new Date(created); minDate.setDate(minDate.getDate() + minDays);
  const maxDate = new Date(created); maxDate.setDate(maxDate.getDate() + maxDays);
  const now = new Date();
  if (minDate < now) minDate.setTime(now.getTime() + 86400000);
  if (maxDate < minDate) maxDate.setTime(minDate.getTime() + 3 * 86400000);
  return { minDate, maxDate };
}

function InlineReview({ rating, adminReply }: { rating: number; adminReply?: string | null }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-md">
        <span className="text-xs font-medium text-amber-700">Sua avaliação:</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
          ))}
        </div>
      </div>
      {adminReply && (
        <div className="ml-3 pl-2 border-l-2 border-primary/30 py-1">
          <p className="text-[10px] font-semibold text-primary">Resposta da loja:</p>
          <p className="text-xs text-muted-foreground">{adminReply}</p>
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  whatsappNumber,
  review,
  onReview,
}: {
  order: Order;
  whatsappNumber: string;
  review?: { rating: number; admin_reply?: string | null } | null;
  onReview: () => void;
}) {
  const display = STATUS_DISPLAY[order.status] ?? STATUS_DISPLAY.novo;
  const StatusIcon = display.icon;
  const estimate = getEstimate(order);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className={`px-4 py-2.5 ${display.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <StatusIcon size={16} className={display.color} />
          <span className={`text-sm font-semibold ${display.color}`}>{display.label}</span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-white/70">
          {order.order_number}
        </Badge>
      </div>

      <Link to={`/client/orders/${order.id}`}>
        <CardContent className="pt-3 pb-3 space-y-3">
          <MiniProgress status={order.status} />

          {estimate && (
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-[#007600] shrink-0" />
              <p className="text-xs text-[#007600] font-medium">
                Entrega estimada: {formatDate(estimate.minDate)} - {formatDate(estimate.maxDate)}
              </p>
            </div>
          )}

          {order.status === "entregue" && !review && (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-600 font-medium">Entregue com sucesso!</p>
            </div>
          )}

          {review && <InlineReview rating={review.rating} adminReply={review.admin_reply} />}

          <p className="text-sm text-gray-700 line-clamp-2">{order.items}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">{formatBRL(order.total_amount ?? 0)}</span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock size={10} />
                {formatDate(order.created_at)}
              </span>
            </div>
            <ChevronRight size={18} className="text-muted-foreground" />
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${order.deposit_paid ? "bg-emerald-500" : "bg-amber-400"}`} />
            <span className="text-[11px] text-muted-foreground">
              Sinal: {order.deposit_paid ? "Pago" : "Pendente"}
            </span>
            {order.balance_paid && (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-muted-foreground">Saldo: Pago</span>
              </>
            )}
          </div>
        </CardContent>
      </Link>

      <div className="px-4 pb-3 flex gap-2">
        {order.status === "entregue" && !review && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
            onClick={onReview}
          >
            <Star size={14} className="fill-amber-400 text-amber-400" />
            Avaliar
          </Button>
        )}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de saber sobre o pedido ${order.order_number}`)}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
        >
          <Button variant="outline" size="sm" className="w-full gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs">
            <MessageSquare size={14} />
            WhatsApp
          </Button>
        </a>
        {order.status === "chegou_brasil" && (
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de agendar a entrega do pedido ${order.order_number}`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1"
          >
            <Button size="sm" className="w-full gap-1.5 text-xs">
              <Truck size={14} />
              Agendar Entrega
            </Button>
          </a>
        )}
        <Link to={`/client/orders/${order.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
            <Package size={14} />
            Detalhes
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default function ClientOrders() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useClientOrders(user?.id ?? "");
  const { data: reviews } = useClientOrderReviews(user?.id ?? "");
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.whatsapp_number ?? "5561999999999";

  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);

  const reviewMap = new Map((reviews ?? []).map((r) => [r.order_id, r]));
  const reviewOrder = reviewOrderId ? (orders ?? []).find((o) => o.id === reviewOrderId) : null;

  const activeOrders = (orders ?? []).filter((o) => o.status !== "entregue" && o.status !== "cancelado");
  const completedOrders = (orders ?? []).filter((o) => o.status === "entregue" || o.status === "cancelado");

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-1">Meus Pedidos</h2>
      <p className="text-xs text-muted-foreground mb-4">Acompanhe seus pedidos em tempo real</p>

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
          {activeOrders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Truck size={14} />
                Em andamento ({activeOrders.length})
              </h3>
              {activeOrders.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  whatsappNumber={whatsappNumber}
                  review={reviewMap.get(o.id)}
                  onReview={() => setReviewOrderId(o.id)}
                />
              ))}
            </div>
          )}

          {completedOrders.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <CheckCircle2 size={14} />
                Finalizados ({completedOrders.length})
              </h3>
              {completedOrders.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  whatsappNumber={whatsappNumber}
                  review={reviewMap.get(o.id)}
                  onReview={() => setReviewOrderId(o.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {reviewOrderId && user && (
        <ReviewDialog
          open={!!reviewOrderId}
          onOpenChange={(open) => { if (!open) setReviewOrderId(null); }}
          orderId={reviewOrderId}
          clientId={user.id}
          orderNumber={reviewOrder?.order_number}
        />
      )}
    </div>
  );
}
