import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Package, Plane, ShoppingCart, CheckCircle2, Clock, Truck,
  MapPin, Loader2, XCircle, Search, Receipt, CircleDollarSign,
  LogIn, ArrowLeft,
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

type TrackingOrder = {
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
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#007600] rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, (currentIdx / (STATUS_FLOW.length - 1)) * 100))}%`,
          }}
        />
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

export default function Rastreio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get("pedido") ?? "";
  const [code, setCode] = useState(initialCode);
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

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
      .select("order_number, status, items, created_at, updated_at")
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

    const { data: eventsData } = await supabase
      .from("order_events")
      .select("id, status, title, description, created_at")
      .eq("order_id", (await supabase.from("orders").select("id").eq("order_number", trimmed).single()).data?.id ?? "")
      .order("created_at", { ascending: true });

    setEvents((eventsData as TrackingEvent[]) ?? []);
    setLoading(false);
  }

  // Auto-search if URL has ?pedido=
  useState(() => {
    if (initialCode) handleSearch();
  });

  const meta = order ? STATUS_META[order.status] ?? STATUS_META.novo : null;
  const estimate = order ? getDeliveryEstimate(order) : null;

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#131921] text-white">
        <div className="px-4 py-3 flex items-center gap-3 max-w-2xl mx-auto">
          <Link to="/" className="shrink-0">
            <Logo size="sm" />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-sm font-bold">Rastreio de Pedido</h1>
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
        <Card>
          <CardContent className="pt-5">
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#232F3E] flex items-center justify-center">
                <Package size={24} className="text-amber-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Rastrear Encomenda</h2>
              <p className="text-xs text-gray-500 mt-1">
                Digite o numero do seu pedido (ex: PED-0001)
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="PED-0001"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-9 h-10 text-sm uppercase font-mono"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !code.trim()}
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-[#FCD200] px-5"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Rastrear"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card>
            <CardContent className="pt-5 text-center">
              <XCircle size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{error}</p>
              <p className="text-xs text-gray-400 mt-1">
                Verifique o numero e tente novamente.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}

        {/* Results */}
        {order && meta && !loading && (
          <>
            {/* Status Card */}
            <Card className="overflow-hidden">
              <div className={`px-4 py-3 ${
                order.status === "entregue" ? "bg-emerald-50"
                  : order.status === "cancelado" ? "bg-red-50"
                  : "bg-amber-50"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <meta.icon size={18} className={meta.color} />
                    <span className={`font-semibold text-sm ${meta.color}`}>{meta.label}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {order.order_number}
                  </Badge>
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
                    </div>
                  </div>
                )}

                <ProgressTracker currentStatus={order.status} />

                {/* Order info */}
                <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Pedido</span>
                    <span className="font-mono font-semibold">{order.order_number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Data</span>
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  {order.items && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-gray-500 shrink-0">Itens</span>
                      <span className="text-right text-gray-900">{order.items}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            {events.length > 0 && (
              <Card>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    Historico
                  </h3>
                  <div className="relative">
                    <div className="absolute left-[9px] top-2 bottom-2 w-px bg-gray-200" />
                    <div className="space-y-4">
                      {[...events].reverse().map((event, i) => {
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
                              <p className={`text-sm font-medium ${isLatest ? "text-gray-900" : "text-gray-500"}`}>
                                {event.title}
                              </p>
                              {event.description && (
                                <p className="text-xs text-gray-400 mt-0.5">{event.description}</p>
                              )}
                              <p className="text-[10px] text-gray-400 mt-1">
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

            {/* CTA */}
            <div className="text-center space-y-3 py-2">
              <p className="text-xs text-gray-500">
                Quer ver mais detalhes? Faca login na sua conta.
              </p>
              <Link to="/login">
                <Button variant="outline" className="gap-2">
                  <LogIn size={16} />
                  Entrar na minha conta
                </Button>
              </Link>
            </div>
          </>
        )}

        {/* Empty state */}
        {!searched && !loading && (
          <div className="text-center py-8 space-y-2">
            <Truck size={40} className="text-gray-300 mx-auto" />
            <p className="text-sm text-gray-500">
              Acompanhe o status do seu pedido em tempo real
            </p>
            <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-2">
              <span className="flex items-center gap-1"><ShoppingCart size={12} /> Compra</span>
              <span>→</span>
              <span className="flex items-center gap-1"><Plane size={12} /> Transito</span>
              <span>→</span>
              <span className="flex items-center gap-1"><Package size={12} /> Entrega</span>
            </div>
          </div>
        )}

        {/* Back to store */}
        <div className="text-center pt-2">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700">
            <ArrowLeft size={14} />
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
