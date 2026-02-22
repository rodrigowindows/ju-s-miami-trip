import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Order, OrderItem, OrderEvent, OrderStatus } from "@/lib/types";
import { toast } from "sonner";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Order[];
    },
  });
}

export function useClientOrders(clientId: string) {
  return useQuery({
    queryKey: ["orders", "client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Order[];
    },
    enabled: !!clientId,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Order;
    },
    enabled: !!id,
  });
}

export function useOrderItems(orderId: string) {
  return useQuery({
    queryKey: ["order_items", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as OrderItem[];
    },
    enabled: !!orderId,
  });
}

export function useOrderEvents(orderId: string) {
  return useQuery({
    queryKey: ["order_events", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_events")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderEvent[];
    },
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: {
      client_id: string;
      customer_name: string;
      customer_phone?: string;
      items: string;
      total_usd: number;
      total_brl: number;
      total_amount: number;
      deposit_amount: number;
      estimated_weight_kg?: number;
      notes?: string;
    }) => {
      const orderNumber = `MB-${Date.now().toString(36).toUpperCase()}`;
      const { data, error } = await supabase
        .from("orders")
        .insert({ ...order, order_number: orderNumber, status: "novo" })
        .select()
        .single();
      if (error) throw error;

      // Create initial event
      await supabase.from("order_events").insert({
        order_id: data.id,
        event_type: "status_change",
        status: "novo",
        title: "Pedido criado",
        description: "Pedido recebido e aguardando orçamento.",
      });

      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar pedido."),
  });
}

export function useCreateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: {
      order_id: string;
      product_name: string;
      store?: string;
      product_url?: string;
      product_image_url?: string;
      price_usd: number;
      price_brl: number;
      quantity?: number;
    }) => {
      const { data, error } = await supabase.from("order_items").insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["order_items", vars.order_id] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId, status, title, description,
    }: {
      orderId: string;
      status: OrderStatus;
      title: string;
      description?: string;
    }) => {
      const { error: orderErr } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      if (orderErr) throw orderErr;

      const { error: eventErr } = await supabase.from("order_events").insert({
        order_id: orderId,
        event_type: "status_change",
        status,
        title,
        description: description ?? null,
      });
      if (eventErr) throw eventErr;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", vars.orderId] });
      queryClient.invalidateQueries({ queryKey: ["order_events", vars.orderId] });
      toast.success("Status atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar status."),
  });
}
