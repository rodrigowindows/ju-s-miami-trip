import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { formatBRL } from "@/lib/format";
import type { WhatsAppTemplate, Order } from "@/types";

export type OrderWithClient = Order & {
  client: { full_name: string | null; phone: string | null; email: string } | null;
};

export function useWhatsAppTemplates() {
  return useQuery({
    queryKey: ["whatsapp_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data ?? []) as WhatsAppTemplate[];
    },
  });
}

export function useOrdersForMessages() {
  return useQuery({
    queryKey: ["orders", "messages"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch client info
      const clientIds = [...new Set((orders ?? []).map((o: Order) => o.client_id))];
      let profileMap = new Map<string, { full_name: string | null; phone: string | null; email: string }>();

      if (clientIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, phone, email")
          .in("id", clientIds);

        profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string | null; phone: string | null; email: string }) => [p.id, p]));
      }

      // Fetch trip codes
      const tripIds = [
        ...new Set(
          (orders ?? [])
            .filter((o: Order) => o.trip_id)
            .map((o: Order) => o.trip_id as string)
        ),
      ];

      let tripMap = new Map<string, string>();
      if (tripIds.length > 0) {
        const { data: trips } = await supabase
          .from("trips")
          .select("id, code")
          .in("id", tripIds);

        tripMap = new Map((trips ?? []).map((t: { id: string; code: string }) => [t.id, t.code]));
      }

      // Fetch order items for summary
      const orderIds = (orders ?? []).map((o: Order) => o.id);
      let itemsMap = new Map<string, string>();
      if (orderIds.length > 0) {
        const { data: items } = await supabase
          .from("order_items")
          .select("order_id, product_name")
          .in("order_id", orderIds);

        const grouped = new Map<string, string[]>();
        for (const item of (items ?? []) as { order_id: string; product_name: string }[]) {
          const list = grouped.get(item.order_id) ?? [];
          list.push(item.product_name);
          grouped.set(item.order_id, list);
        }
        for (const [orderId, names] of grouped) {
          itemsMap.set(orderId, names.join(", "));
        }
      }

      return (orders ?? []).map((o: Order) => ({
        ...o,
        client: profileMap.get(o.client_id) ?? null,
        trip_code: o.trip_id ? tripMap.get(o.trip_id) ?? "" : "",
        items_summary: itemsMap.get(o.id) ?? o.items ?? "",
      })) as (OrderWithClient & { trip_code: string; items_summary: string })[];
    },
  });
}

export function fillTemplate(
  template: string,
  order: OrderWithClient & { trip_code?: string; items_summary?: string }
): string {
  const clientName = order.client?.full_name ?? "Cliente";
  const itemsSummary = (order as { items_summary?: string }).items_summary ?? order.items ?? "";
  const totalAmount = order.total_amount ?? 0;
  const depositAmount = order.deposit_amount ?? 0;

  return template
    .replace(/{nome_cliente}/g, clientName)
    .replace(/{numero_pedido}/g, order.order_number)
    .replace(/{itens}/g, itemsSummary)
    .replace(/{item}/g, itemsSummary)
    .replace(/{valor_total}/g, formatBRL(totalAmount))
    .replace(/{valor_sinal}/g, formatBRL(depositAmount))
    .replace(/{codigo_viagem}/g, (order as { trip_code?: string }).trip_code ?? "");
}
