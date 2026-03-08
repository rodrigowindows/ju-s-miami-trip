import { useState } from "react";
import { Star } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Plane,
  ShoppingCart,
  CheckCircle2,
  Clock,
  MessageSquare,
  Truck,
  MapPin,
  CreditCard,
  Loader2,
  XCircle,
  Receipt,
  CircleDollarSign,
  Copy,
  QrCode,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrder, useOrderItems, useOrderEvents } from "@/hooks/useOrders";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { useClientOrderReviews, useCreateOrderReview } from "@/hooks/useOrderReviews";
import { formatBRL, formatDate, formatDateTime, formatRelativeTime } from "@/lib/format";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import type { OrderStatus } from "@/types";

// ── Status flow (ordered) ─────────────────────
const STATUS_FLOW: OrderStatus[] = [
  "novo",
  "orcamento",
  "aprovado",
  "comprando",
  "comprado",
  "em_transito",
  "chegou_brasil",
  "entregue",
];

const STATUS_META: Record<string, { label: string; icon: typeof Package; description: string; color: string }> = {
  novo: { label: "Pedido Recebido", icon: Receipt, description: "Estamos analisando seu pedido", color: "text-gray-500" },
  orcamento: { label: "Orçamento Enviado", icon: CircleDollarSign, description: "Aguardando aprovação do orçamento", color: "text-amber-600" },
  aprovado: { label: "Aprovado", icon: CheckCircle2, description: "Pedido aprovado, vamos comprar!", color: "text-blue-600" },
  comprando: { label: "Comprando nos EUA", icon: ShoppingCart, description: "Nosso shopper está comprando em Miami", color: "text-orange-600" },
  comprado: { label: "Comprado", icon: Package, description: "Produto comprado e aguardando viagem", color: "text-teal-600" },
  em_transito: { label: "Em Trânsito", icon: Plane, description: "Seu produto está vindo para o Brasil", color: "text-purple-600" },
  chegou_brasil: { label: "Chegou no Brasil", icon: MapPin, description: "Chegou! Vamos combinar a entrega", color: "text-green-600" },
  entregue: { label: "Entregue", icon: CheckCircle2, description: "Pedido entregue com sucesso!", color: "text-emerald-600" },
  cancelado: { label: "Cancelado", icon: XCircle, description: "Pedido foi cancelado", color: "text-red-500" },
};

function getDeliveryEstimate(order: { status: string; created_at: string }) {
  if (order.status === "entregue") return null;
  if (order.status === "cancelado") return null;

  const created = new Date(order.created_at);
  const statusIdx = STATUS_FLOW.indexOf(order.status as OrderStatus);

  // Estimate: 15-25 days from order creation for typical delivery
  const minDays = statusIdx >= 5 ? 2 : statusIdx >= 4 ? 7 : 15;
  const maxDays = statusIdx >= 5 ? 5 : statusIdx >= 4 ? 14 : 25;

  const minDate = new Date(created);
  minDate.setDate(minDate.getDate() + minDays);
  const maxDate = new Date(created);
  maxDate.setDate(maxDate.getDate() + maxDays);

  // Clamp to future
  const now = new Date();
  if (minDate < now) minDate.setTime(now.getTime() + 86400000);
  if (maxDate < minDate) maxDate.setTime(minDate.getTime() + 3 * 86400000);

  return { minDate, maxDate };
}

function ProgressTracker({ currentStatus }: { currentStatus: string }) {
  if (currentStatus === "cancelado") {
    return (
      <div className="flex items-center gap-2 bg-red-50 rounded-lg p-3">
        <XCircle size={20} className="text-red-500" />
        <span className="text-sm font-medium text-red-700">Pedido cancelado</span>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(currentStatus as OrderStatus);
  // Simplified milestones for the visual bar
  const milestones = [
    { key: "aprovado", label: "Aprovado", idx: 2 },
    { key: "comprado", label: "Comprado", idx: 4 },
    { key: "em_transito", label: "Em Trânsito", idx: 5 },
    { key: "chegou_brasil", label: "No Brasil", idx: 6 },
    { key: "entregue", label: "Entregue", idx: 7 },
  ];

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full" />
        {/* Progress fill */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#007600] rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, (currentIdx / (STATUS_FLOW.length - 1)) * 100))}%`,
          }}
        />
        {/* Milestone dots */}
        {milestones.map((m) => {
          const done = currentIdx >= m.idx;
          const active = currentIdx === m.idx;
          return (
            <div key={m.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  done
                    ? "bg-[#007600] border-[#007600]"
                    : active
                    ? "bg-white border-[#007600]"
                    : "bg-white border-gray-300"
                }`}
              >
                {done && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <span
                className={`text-[9px] mt-1 font-medium text-center leading-tight w-14 ${
                  done ? "text-[#007600]" : "text-gray-400"
                }`}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ClientOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id ?? "");
  const { data: items } = useOrderItems(id ?? "");
  const { data: events } = useOrderEvents(id ?? "");
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.whatsapp_number ?? "5561999999999";
  const pixKey = settings?.pix_key || "ajuvaiparamiami@pix.com";
  const pixKeyHolder = settings?.pix_key_holder || "AjuVaiParaMiami";
  const pixQrImage = settings?.pix_qr_image || "";
  const [showPix, setShowPix] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  if (isLoading || !order) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const meta = STATUS_META[order.status] ?? STATUS_META.novo;
  const StatusIcon = meta.icon;
  const estimate = getDeliveryEstimate(order);
  const depositPaid = order.deposit_paid;
  const balancePaid = order.balance_paid;
  const totalPaid = (depositPaid ? order.deposit_amount : 0) + (balancePaid ? (order.total_amount - order.deposit_amount) : 0);

  return (
    <div className="space-y-4 pb-4">
      {/* Back + order number */}
      <div className="flex items-center gap-3">
        <Link to="/client/orders" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-display text-lg font-bold">Pedido {order.order_number}</h2>
          <p className="text-xs text-muted-foreground">Feito em {formatDate(order.created_at)}</p>
        </div>
      </div>

      {/* ── Main status card (Amazon style) ──────── */}
      <Card className="overflow-hidden">
        <div className={`px-4 py-3 ${order.status === "entregue" ? "bg-emerald-50" : order.status === "cancelado" ? "bg-red-50" : "bg-amber-50"}`}>
          <div className="flex items-center gap-2">
            <StatusIcon size={18} className={meta.color} />
            <span className={`font-semibold text-sm ${meta.color}`}>{meta.label}</span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">{meta.description}</p>
        </div>

        <CardContent className="pt-4 space-y-4">
          {/* Delivery estimate */}
          {estimate && (
            <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
              <Truck size={20} className="text-[#007600] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Entrega estimada</p>
                <p className="text-sm text-[#007600] font-medium">
                  {formatDate(estimate.minDate)} - {formatDate(estimate.maxDate)}
                </p>
              </div>
            </div>
          )}

          {order.status === "entregue" && (
            <div className="flex items-start gap-3 bg-emerald-50 rounded-lg p-3">
              <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Entregue com sucesso!</p>
                <p className="text-xs text-emerald-600">{formatRelativeTime(order.updated_at)}</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <ProgressTracker currentStatus={order.status} />
        </CardContent>
      </Card>

      {/* ── Items ────────────────────────────────── */}
      <Card>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Package size={16} className="text-muted-foreground" />
            Itens do Pedido
          </h3>
          {(items ?? []).length > 0 ? (
            <div className="space-y-3">
              {(items ?? []).map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  {item.product_image_url ? (
                    <img
                      src={item.product_image_url}
                      alt={item.product_name}
                      className="w-14 h-14 rounded-lg object-cover bg-muted shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Qtd: {item.quantity}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.price_usd && (
                        <span className="text-xs text-muted-foreground">US$ {item.price_usd.toFixed(2)}</span>
                      )}
                      {item.price_brl && (
                        <span className="text-xs font-semibold">{formatBRL(item.price_brl)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : order.items ? (
            <p className="text-sm text-muted-foreground">{order.items}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Nenhum item detalhado.</p>
          )}
        </CardContent>
      </Card>

      {/* ── Payment ──────────────────────────────── */}
      <Card>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <CreditCard size={16} className="text-muted-foreground" />
            Pagamento
          </h3>

          <div className="space-y-2">
            {/* Deposit */}
            <div className="flex items-center justify-between py-2 border-b border-dashed">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${depositPaid ? "bg-emerald-500" : "bg-amber-400"}`} />
                <span className="text-sm">Sinal</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold">{formatBRL(order.deposit_amount)}</span>
                <Badge
                  variant="outline"
                  className={`ml-2 text-[10px] ${depositPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                >
                  {depositPaid ? "Pago" : "Pendente"}
                </Badge>
              </div>
            </div>

            {/* Balance */}
            <div className="flex items-center justify-between py-2 border-b border-dashed">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${balancePaid ? "bg-emerald-500" : "bg-gray-300"}`} />
                <span className="text-sm">Saldo restante</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold">{formatBRL(Math.max(0, order.total_amount - order.deposit_amount))}</span>
                <Badge
                  variant="outline"
                  className={`ml-2 text-[10px] ${balancePaid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}
                >
                  {balancePaid ? "Pago" : "Na entrega"}
                </Badge>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-semibold text-sm">Total</span>
              <div className="text-right">
                <span className="font-bold text-base">{formatBRL(order.total_amount)}</span>
                <p className="text-[10px] text-muted-foreground">
                  {formatBRL(totalPaid)} pago de {formatBRL(order.total_amount)}
                </p>
              </div>
            </div>

            {/* Pay Deposit via PIX */}
            {!depositPaid && order.deposit_amount > 0 && order.status !== "cancelado" && (
              <div className="pt-3 space-y-3">
                {!showPix ? (
                  <Button
                    onClick={() => setShowPix(true)}
                    className="w-full gap-2 bg-[#007600] hover:bg-[#005f00] text-white"
                  >
                    <CreditCard size={16} />
                    Pagar Sinal {formatBRL(order.deposit_amount)}
                  </Button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <QrCode size={18} className="text-emerald-600" />
                      <p className="text-sm font-semibold text-emerald-800">Pague via PIX</p>
                    </div>

                    <p className="text-xs text-gray-600 text-center">
                      Valor do sinal: <strong>{formatBRL(order.deposit_amount)}</strong>
                    </p>

                    {/* QR Code Image */}
                    {pixQrImage && (
                      <div className="flex justify-center">
                        <img
                          src={pixQrImage}
                          alt="QR Code PIX"
                          className="w-48 h-48 rounded-lg border border-emerald-200 bg-white p-2"
                        />
                      </div>
                    )}

                    {/* PIX Key */}
                    <div className="bg-white rounded-lg p-3 space-y-2">
                      <p className="text-xs text-gray-500">Chave PIX:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm text-gray-800 font-medium break-all">{pixKey}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(pixKey);
                            setPixCopied(true);
                            toast.success("Chave PIX copiada!");
                            setTimeout(() => setPixCopied(false), 3000);
                          }}
                          className="shrink-0 gap-1 text-xs"
                        >
                          <Copy size={12} /> {pixCopied ? "Copiado!" : "Copiar"}
                        </Button>
                      </div>
                      {pixKeyHolder && (
                        <p className="text-xs text-gray-500">Titular: <strong>{pixKeyHolder}</strong></p>
                      )}
                    </div>

                    {/* Send receipt via WhatsApp */}
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Olá! Segue o comprovante do PIX referente ao pedido *${order.order_number}*.\n\nValor do sinal: *${formatBRL(order.deposit_amount)}*\n\nAguardo confirmação!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button className="w-full h-11 bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2">
                        <MessageCircle size={18} />
                        Enviar comprovante via WhatsApp
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Timeline ─────────────────────────────── */}
      {(events ?? []).length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              Histórico
            </h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gray-200" />

              <div className="space-y-4">
                {[...(events ?? [])].reverse().map((event, i) => {
                  const eventMeta = STATUS_META[event.status];
                  const isLatest = i === 0;
                  return (
                    <div key={event.id} className="flex gap-3 relative">
                      <div
                        className={`w-[18px] h-[18px] rounded-full border-2 shrink-0 z-10 mt-0.5 ${
                          isLatest
                            ? "bg-[#007600] border-[#007600]"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {isLatest && <CheckCircle2 size={10} className="text-white m-[2px]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isLatest ? "text-foreground" : "text-muted-foreground"}`}>
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatDateTime(event.created_at)}
                        </p>
                      </div>
                      {eventMeta && (
                        <Badge variant="outline" className={`shrink-0 text-[9px] h-5 ${eventMeta.color}`}>
                          {eventMeta.label}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Actions ──────────────────────────────── */}
      <div className="flex gap-2">
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de saber sobre o pedido ${order.order_number}`)}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
        >
          <Button variant="outline" className="w-full gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
            <MessageSquare size={16} />
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
            <Button className="w-full gap-2">
              <Truck size={16} />
              Agendar Entrega
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
