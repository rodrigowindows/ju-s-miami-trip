import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { ClipboardList, ShoppingBag, Plane, DollarSign } from "lucide-react";

interface SummaryData {
  awaitingQuote: number;
  activeOrders: number;
  tripsThisWeek: number;
  pendingRevenue: number;
}

export default function SummaryCards() {
  const [data, setData] = useState<SummaryData>({
    awaitingQuote: 0,
    activeOrders: 0,
    tripsThisWeek: 0,
    pendingRevenue: 0,
  });

  useEffect(() => {
    async function load() {
      const [quoteRes, activeRes, tripsRes, revenueRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .in("status", ["novo", "orcamento"]),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .in("status", ["aprovado", "comprando", "em_viagem", "entregar"]),
        supabase
          .from("trips")
          .select("id", { count: "exact", head: true })
          .gte("departure_date", getWeekStart())
          .lte("departure_date", getWeekEnd()),
        supabase
          .from("orders")
          .select("price_brl")
          .eq("balance_paid", false)
          .in("status", ["aprovado", "comprando", "em_viagem", "entregar"]),
      ]);

      const pendingRevenue =
        revenueRes.data?.reduce(
          (sum, o) => sum + (Number(o.price_brl) || 0),
          0
        ) ?? 0;

      setData({
        awaitingQuote: quoteRes.count ?? 0,
        activeOrders: activeRes.count ?? 0,
        tripsThisWeek: tripsRes.count ?? 0,
        pendingRevenue,
      });
    }
    load();
  }, []);

  const cards = [
    {
      title: "Aguardando Orçamento",
      value: data.awaitingQuote,
      icon: ClipboardList,
      format: (v: number) => String(v),
    },
    {
      title: "Pedidos Ativos",
      value: data.activeOrders,
      icon: ShoppingBag,
      format: (v: number) => String(v),
    },
    {
      title: "Viagens Esta Semana",
      value: data.tripsThisWeek,
      icon: Plane,
      format: (v: number) => String(v),
    },
    {
      title: "Receita Pendente",
      value: data.pendingRevenue,
      icon: DollarSign,
      format: (v: number) =>
        v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{card.format(card.value)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d.setDate(diff));
  return start.toISOString().split("T")[0];
}

function getWeekEnd(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  const end = new Date(d.setDate(diff));
  return end.toISOString().split("T")[0];
}
