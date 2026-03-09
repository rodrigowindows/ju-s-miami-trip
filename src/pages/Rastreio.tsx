import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Package, Plane, ShoppingCart, CheckCircle2, Clock, Truck,
  MapPin, Loader2, XCircle, Search, Receipt, CircleDollarSign,
  LogIn, ArrowLeft, RefreshCw, Bell,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/shared/Logo";
import { formatDate, formatDateTime } from "@/lib/format";
import type { OrderStatus } from "@/types";

const STATUS_FLOW: OrderStatus[] = [
  "novo", "orcamento", "aprovado", "comprando", "comprado",
  "em_transito", "chegou_brasil", "entregue",
];

const STATUS_META: Record<string, { label: string; icon: typeof Package; description: string; color: string; bg: string }> = {
  novo:           { label: "Pedido Recebido",    icon: Receipt,         description: "Estamos analisando seu pedido",              color: "text-gray-500",    bg: "bg-gray-100" },
  orcamento:      { label: "Orçamento Enviado",  icon: CircleDollarSign, description: "Aguardando aprovação do orçamento",         color: "text-amber-600",   bg: "bg-amber-50" },
  aprovado:       { label: "Aprovado",           icon: CheckCircle2,    description: "Pedido aprovado, vamos comprar!",            color: "text-blue-600",    bg: "bg-blue-50" },
  comprando:      { label: "Comprando nos EUA",  icon: ShoppingCart,    description: "Nosso shopper está comprando em Miami",      color: "text-orange-600",  bg: "bg-orange-50" },
  comprado:       { label: "Comprado",           icon: Package,         description: "Produto comprado e aguardando viagem",       color: "text-teal-600",    bg: "bg-teal-50" },
  em_transito:    { label: "Em Trânsito",        icon: Plane,           description: "Seu produto está vindo para o Brasil",       color: "text-purple-600",  bg: "bg-purple-50" },
  chegou_brasil:  { label: "Chegou no Brasil",   icon: MapPin,          description: "Chegou! Vamos combinar a entrega",          color: "text-green-600",   bg: "bg-green-50" },
  entregue:       { label: "Entregue",           icon: CheckCircle2,    description: "Pedido entregue com sucesso!",               color: "text-emerald-600", bg: "bg-emerald-50" },
  cancelado:      { label: "Cancelado",          icon: XCircle,         description: "Pedido foi cancelado",                       color: "text-red-500",     bg: "bg-red-50" },
};

type TrackingOrder = {
  id: string;
  order_number: string;
  status: string;
  items: string;
  created_at: string;
  updated_at: string;
};

type TrackingEvent = {
  id: string;
  status: string;
  title: string;
  description: string | null;
  created_at: string;
};

function getDeliveryEstimate(order: { status: string; created_at: string }) {
  if (order.status === "entregue" || order.status === "cancelado") return null;
  const created = new Date(order.created_at);
  const statusIdx = STATUS_FLOW.indexOf(order.status as OrderStatus);
  const minDays = statusIdx >= 5 ? 2 : statusIdx >= 4 ? 7 : 15;
  const maxDays = statusIdx >= 5 ? 5 : statusIdx >= 4 ? 14 : 25;
  const minDate = new Date(created);
  minDate.setDate(minDate.getDate() + minDays);
  const maxDate = new Date(created);
  maxDate.setDate(maxDate.getDate() + maxDays);
  const now = new Date();
  if (minDate < now) minDate.setTime(now.getTime() + 86400000);
  if (maxDate < minDate) maxDate.setTime(minDate.getTime() + 3 * 86400000);
  return { minDate, maxDate };
}

function getProgressPercent(status: string) {
  if (status === "cancelado") return 0;
  const idx = STATUS_FLOW.indexOf(status as OrderStatus);
  if (idx < 0) return 0;
  return Math.round((idx / (STATUS_FLOW.length - 1)) * 100);
}

/* ── Visual Progress Tracker ── */
function ProgressTracker({ currentStatus }: { currentStatus: string }) {
  if (currentStatus === "cancelado") {
    return (
      <div className="flex items-center gap-2 bg-red-50 rounded-xl p-4 border border-red-200">
        <XCircle size={20} className="text-red-500" />
        <span className="text-sm font-semibold text-red-700">Pedido cancelado</span>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(currentStatus as OrderStatus);
  const percent = getProgressPercent(currentStatus);

  return (
    <div className="space-y-3">
      {/* Percentage badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Progresso do pedido</span>
        <Badge variant="secondary" className="text-xs font-bold">{percent}%</Badge>
      </div>

      {/* Progress bar */}
      <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 via-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-4 gap-1 pt-1">
        {[
          { key: "aprovado", label: "Aprovado", idx: 2, icon: CheckCircle2 },
          { key: "comprado", label: "Comprado", idx: 4, icon: Package },
          { key: "em_transito", label: "Em Trânsito", idx: 5, icon: Plane },
          { key: "entregue", label: "Entregue", idx: 7, icon: CheckCircle2 },
        ].map((m) => {
          const done = currentIdx >= m.idx;
          const active = currentIdx === m.idx;
          const Icon = m.icon;
          return (
            <div key={m.key} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  done
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                    : active
                    ? "bg-white border-2 border-emerald-500 text-emerald-500"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                <Icon size={14} />
              </div>
              <span
                className={`text-[10px] font-medium text-center leading-tight ${
                  done ? "text-emerald-700" : active ? "text-emerald-600" : "text-gray-400"
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

/* ── Timeline Event ── */
function TimelineEvent({ event, isLatest, isLast }: { event: TrackingEvent; isLatest: boolean; isLast: boolean }) {
  const eventMeta = STATUS_META[event.status];
  const Icon = eventMeta?.icon ?? Clock;

  return (
    <div className="flex gap-3 relative">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[15px] top-[34px] bottom-[-16px] w-0.5 bg-gradient-to-b from-gray-300 to-gray-100" />
      )}

      {/* Dot */}
      <div
        className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
          isLatest
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 animate-pulse"
            : "bg-white border-2 border-gray-200 text-gray-400"
        }`}
      >
        <Icon size={14} />
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 pb-5 ${isLatest ? "" : "opacity-70"}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`text-sm font-semibold ${isLatest ? "text-foreground" : "text-muted-foreground"}`}>
              {event.title}
            </p>
            {event.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
            )}
          </div>
          {eventMeta && (
            <Badge
              variant="outline"
              className={`shrink-0 text-[9px] h-5 ${eventMeta.color} border-current/20`}
            >
              {eventMeta.label}
            </Badge>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
          <Clock size={10} />
          {formatDateTime(event.created_at)}
        </p>
      </div>
    </div>
  );
}

/* ── Live indicator ── */
function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-[10px] font-medium text-green-600">Ao vivo</span>
    </div>
  );
}

/* ── Main Page ── */
export default function Rastreio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get("pedido") ?? "";
  const [code, setCode] = useState(initialCode);
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [liveUpdate, setLiveUpdate] = useState(false);

  const fetchEvents = useCallback(async (orderId: string) => {
    const { data } = await supabase
      .from("order_events")
      .select("id, status, title, description, created_at")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });
    setEvents((data as TrackingEvent[]) ?? []);
  }, []);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setSearchParams({ pedido: trimmed });

    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .select("id, order_number, status, items, created_at, updated_at")
      .eq("order_number", trimmed)
      .maybeSingle();

    if (orderErr || !orderData) {
      setOrder(null);
      setEvents([]);
      setError(orderErr ? "Erro ao buscar pedido." : "Pedido não encontrado.");
      setLoading(false);
      return;
    }

    setOrder(orderData as TrackingOrder);
    await fetchEvents((orderData as TrackingOrder).id);
    setLoading(false);
  }

  // Auto-search from URL
  useEffect(() => {
    if (initialCode) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  // Real-time subscription
  useEffect(() => {
    if (!order?.id) return;

    const channel = supabase
      .channel(`tracking-${order.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${order.id}` },
        (payload) => {
          const updated = payload.new as any;
          setOrder((prev) =>
            prev ? { ...prev, status: updated.status, updated_at: updated.updated_at } : prev
          );
          setLiveUpdate(true);
          setTimeout(() => setLiveUpdate(false), 3000);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_events", filter: `order_id=eq.${order.id}` },
        () => {
          fetchEvents(order.id);
          setLiveUpdate(true);
          setTimeout(() => setLiveUpdate(false), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id, fetchEvents]);

  const meta = order ? STATUS_META[order.status] ?? STATUS_META.novo : null;
  const estimate = order ? getDeliveryEstimate(order) : null;

  return (
    <div className="min-h-screen bg-muted/50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#131921] text-white">
        <div className="px-4 py-3 flex items-center gap-3 max-w-2xl mx-auto">
          <Link to="/" className="shrink-0">
            <Logo size="sm" />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-sm font-bold tracking-tight">Rastreamento de Pedido</h1>
          </div>
          <Link
            to="/login"
            className="shrink-0 flex items-center gap-1.5 text-white text-xs hover:text-amber-300 transition-colors"
          >
            <LogIn size={16} />
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Search form */}
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 pb-5">
            <div className="text-center mb-5">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#232F3E] to-[#131921] flex items-center justify-center shadow-lg">
                <Package size={26} className="text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Rastrear Encomenda</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Digite o número do seu pedido (ex: PED-0001)
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="PED-0001"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-9 h-11 text-sm uppercase font-mono border-2 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !code.trim()}
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-[#FCD200] px-6 h-11 font-semibold"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Rastrear"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <XCircle size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-foreground">{error}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Verifique o número e tente novamente.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Buscando pedido...</p>
          </div>
        )}

        {/* Results */}
        {order && meta && !loading && (
          <>
            {/* Status Hero Card */}
            <Card className={`border-0 shadow-lg overflow-hidden ${liveUpdate ? "ring-2 ring-green-400 ring-offset-2 transition-all" : ""}`}>
              <div className={`px-5 py-4 ${meta.bg}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.color} bg-white/80`}>
                      <meta.icon size={20} />
                    </div>
                    <div>
                      <span className={`font-bold text-base ${meta.color}`}>{meta.label}</span>
                      <p className="text-xs text-muted-foreground">{meta.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="text-[10px] font-mono font-bold">
                      {order.order_number}
                    </Badge>
                    <LiveBadge />
                  </div>
                </div>
              </div>

              <CardContent className="pt-5 space-y-5">
                {/* Delivery estimate */}
                {estimate && (
                  <div className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Truck size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Entrega estimada</p>
                      <p className="text-sm text-emerald-700 font-semibold">
                        {formatDate(estimate.minDate)} — {formatDate(estimate.maxDate)}
                      </p>
                    </div>
                  </div>
                )}

                {order.status === "entregue" && (
                  <div className="flex items-start gap-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-800">Entregue com sucesso! 🎉</p>
                      <p className="text-xs text-emerald-600 mt-0.5">Obrigado por comprar com a gente!</p>
                    </div>
                  </div>
                )}

                <ProgressTracker currentStatus={order.status} />

                {/* Order info */}
                <div className="border-t border-border pt-4 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pedido</span>
                    <span className="font-mono font-bold">{order.order_number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Data do pedido</span>
                    <span className="font-medium">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Última atualização</span>
                    <span className="font-medium">{formatDateTime(order.updated_at)}</span>
                  </div>
                  {order.items && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-muted-foreground shrink-0">Itens</span>
                      <span className="text-right font-medium text-foreground">{order.items}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    Histórico do Pedido
                  </h3>
                  <div className="flex items-center gap-2">
                    {liveUpdate && (
                      <Badge variant="secondary" className="text-[10px] gap-1 animate-in fade-in">
                        <Bell size={10} />
                        Atualizado!
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => order && fetchEvents(order.id)}
                      className="h-7 w-7 p-0"
                    >
                      <RefreshCw size={14} />
                    </Button>
                  </div>
                </div>

                {events.length > 0 ? (
                  <div className="pl-1">
                    {[...events].reverse().map((event, i, arr) => (
                      <TimelineEvent
                        key={event.id}
                        event={event}
                        isLatest={i === 0}
                        isLast={i === arr.length - 1}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock size={24} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum evento registrado ainda.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center space-y-3 py-2">
              <p className="text-xs text-muted-foreground">
                Quer ver mais detalhes? Faça login na sua conta.
              </p>
              <Link to="/login">
                <Button variant="outline" className="gap-2 font-semibold">
                  <LogIn size={16} />
                  Entrar na minha conta
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* Empty state */}
        {!searched && !loading && (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Truck size={32} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Acompanhe o status do seu pedido em tempo real
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground pt-1">
              <span className="flex items-center gap-1"><ShoppingCart size={12} /> Compra</span>
              <span className="text-muted-foreground/50">→</span>
              <span className="flex items-center gap-1"><Plane size={12} /> Trânsito</span>
              <span className="text-muted-foreground/50">→</span>
              <span className="flex items-center gap-1"><Package size={12} /> Entrega</span>
            </div>
          </div>
        )}

        {/* Back to store */}
        <div className="text-center pt-2 pb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} />
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
