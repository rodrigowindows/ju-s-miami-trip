import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/format";
import { fetchProfileMapFull } from "@/lib/profileMap";
import type { WhatsAppTemplate, Order } from "@/types";

export type OrderWithClient = Order & {
  client: { full_name: string | null; phone: string | null; email: string } | null;
  trip_code: string;
  items_summary: string;
};

// ── Queries ────────────────────────────────────

export function useWhatsAppTemplates() {
  return useQuery({
    queryKey: ["whatsapp_templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data ?? []).map((d) => ({
        id: d.id,
        slug: d.name,
        title: d.name,
        icon: 'MessageSquare',
        template_text: d.template,
        created_at: d.created_at,
      })) as WhatsAppTemplate[];
    },
  });
}

export function useOrdersForMessages(statusFilter?: string) {
  return useQuery({
    queryKey: ["orders", "messages", statusFilter ?? "all"],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data: orders, error } = await query;
      if (error) throw error;

      const clientIds = [...new Set((orders ?? []).map((o: Order) => o.client_id))];
      const profileMap = await fetchProfileMapFull(clientIds);

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

      const orderIds = (orders ?? []).map((o: Order) => o.id);
      const itemsMap = new Map<string, string>();
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
      })) as OrderWithClient[];
    },
  });
}

// ── Mutations ──────────────────────────────────

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      slug: string;
      title: string;
      icon: string;
      template_text: string;
    }) => {
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .insert({ name: input.title, template: input.template_text })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp_templates"] }),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      slug?: string;
      title?: string;
      icon?: string;
      template_text?: string;
    }) => {
      const dbUpdates: Record<string, string> = {};
      if (updates.title) dbUpdates.name = updates.title;
      if (updates.template_text) dbUpdates.template = updates.template_text;
      const { data, error } = await supabase
        .from("whatsapp_templates")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp_templates"] }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("whatsapp_templates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp_templates"] }),
  });
}

// ── Template ↔ Status mapping ──────────────────

export const TEMPLATE_STATUS_MAP: Record<string, string> = {
  orcamento: "novo",
  confirmacao: "aprovado",
  compra: "aprovado",
  comprado: "comprado",
  comprando: "comprando",
  em_transito: "em_transito",
  em_viagem: "em_transito",
  chegou: "chegou_brasil",
  entrega: "entregue",
  entregue: "entregue",
  esgotado: "comprado",
};

// ── Template variable replacement ──────────────

export function fillTemplate(
  template: string,
  order: OrderWithClient
): string {
  const clientName = order.client?.full_name ?? "Cliente";
  const itemsSummary = order.items_summary ?? order.items ?? "";
  const totalAmount = order.total_amount ?? 0;
  const depositAmount = order.deposit_amount ?? 0;

  return template
    .replace(/{nome_cliente}/g, clientName)
    .replace(/{numero_pedido}/g, order.order_number)
    .replace(/{itens}/g, itemsSummary)
    .replace(/{item}/g, itemsSummary)
    .replace(/{valor_total}/g, formatBRL(totalAmount))
    .replace(/{valor_sinal}/g, formatBRL(depositAmount))
    .replace(/{codigo_viagem}/g, order.trip_code ?? "");
}

export const TEMPLATE_VARIABLES = [
  { key: "{nome_cliente}", label: "Nome do cliente" },
  { key: "{numero_pedido}", label: "Numero do pedido" },
  { key: "{itens}", label: "Lista de itens" },
  { key: "{valor_total}", label: "Valor total R$" },
  { key: "{valor_sinal}", label: "Valor do sinal R$" },
  { key: "{codigo_viagem}", label: "Codigo da viagem" },
];
