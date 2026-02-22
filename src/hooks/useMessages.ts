import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { WhatsAppTemplate, Order } from "@/integrations/supabase/types";

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

      // Also fetch trip codes for orders with trip_id
      const tripIds = [
        ...new Set(
          (orders ?? [])
            .filter((o) => o.trip_id)
            .map((o) => o.trip_id as string)
        ),
      ];

      let tripMap = new Map<string, string>();
      if (tripIds.length > 0) {
        const { data: trips } = await supabase
          .from("trips")
          .select("id, code")
          .in("id", tripIds);

        tripMap = new Map((trips ?? []).map((t) => [t.id, t.code]));
      }

      return (orders ?? []).map((o) => ({
        ...o,
        trip_code: o.trip_id ? tripMap.get(o.trip_id) ?? "" : "",
      })) as (Order & { trip_code: string })[];
    },
  });
}

export function fillTemplate(
  template: string,
  order: Order & { trip_code?: string }
): string {
  return template
    .replace(/{nome_cliente}/g, order.customer_name)
    .replace(/{numero_pedido}/g, order.order_number)
    .replace(/{itens}/g, order.items)
    .replace(/{valor_total}/g, order.total_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 }))
    .replace(/{valor_sinal}/g, order.deposit_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 }))
    .replace(/{codigo_viagem}/g, order.trip_code ?? "")
    .replace(/{item}/g, order.items);
}
