import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { Order, OrderItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronRight } from "lucide-react";

type TabKey = "ativos" | "entregues" | "todos";

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

const STATUS_INFO: Record<string, string> = {
  novo: "Aguardando orçamento",
  orcamento: "Aguardando aprovação",
  aprovado: "Sinal pago",
  comprando: "Em processo de compra",
  comprado: "Aguardando envio",
  em_transito: "A caminho do Brasil",
  chegou_brasil: "Pronto para entrega",
  entregue: "Pedido entregue",
  cancelado: "Pedido cancelado",
};

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("ativos");

  useEffect(() => {
    if (!user) return;
    async function fetch() {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("client_id", user!.id)
        .order("created_at", { ascending: false });
      setOrders((data as OrderWithItems[]) ?? []);
      setLoading(false);
    }
    fetch();
  }, [user]);

  const activeOrders = orders.filter(
    (o) => !["entregue", "cancelado"].includes(o.status)
  );
  const deliveredOrders = orders.filter((o) => o.status === "entregue");

  const filteredOrders =
    activeTab === "ativos"
      ? activeOrders
      : activeTab === "entregues"
      ? deliveredOrders
      : orders;

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "ativos", label: "Ativos", count: activeOrders.length },
    { key: "entregues", label: "Entregues", count: deliveredOrders.length },
    { key: "todos", label: "Todos", count: orders.length },
  ];

  function getItemsSummary(items: OrderItem[]) {
    if (items.length === 0) return "Sem itens";
    if (items.length === 1) return items[0].product_name;
    return `${items[0].product_name} +${items.length - 1}`;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 pt-3 pb-0">
        <h1 className="font-display text-xl font-bold text-foreground mb-3">
          Meus Pedidos
        </h1>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold px-1 ${
                  activeTab === tab.key
                    ? "bg-violet-100 text-violet-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Order List */}
      <main className="px-4 pt-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-muted-foreground">
              {activeTab === "ativos"
                ? "Nenhum pedido ativo"
                : activeTab === "entregues"
                ? "Nenhum pedido entregue ainda"
                : "Você ainda não fez nenhum pedido"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.novo;
              const info = STATUS_INFO[order.status] ?? "";

              return (
                <button
                  key={order.id}
                  onClick={() => navigate(`/client/orders/${order.id}`)}
                  className="w-full bg-white rounded-xl border border-border p-4 text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-semibold text-foreground">
                          {order.order_number}
                        </span>
                        <Badge
                          className={`${config.color} text-[10px] font-semibold border-0 rounded-full px-2`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground font-medium truncate">
                        {getItemsSummary(order.order_items)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{info}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {order.total_brl && (
                        <span className="text-sm font-bold text-foreground">
                          R$ {order.total_brl.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
