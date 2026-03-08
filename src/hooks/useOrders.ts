import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchProfileMapFull } from "@/lib/profileMap";
import type { Order, OrderWithClient, TablesInsert } from "@/types";

export type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  product_url: string | null;
  product_image_url: string | null;
  quantity: number;
  price_usd: number | null;
  price_brl: number | null;
  created_at: string;
};

export type OrderEvent = {
  id: string;
  order_id: string;
  status: string;
  title: string;
  description: string | null;
  created_at: string;
};

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<OrderWithClient[]> => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const clientIds = [...new Set((orders ?? []).map((o: Order) => o.client_id))];
      const profileMap = await fetchProfileMapFull(clientIds);

      return (orders ?? []).map((o: Order) => ({
        ...o,
        client: profileMap.get(o.client_id) ?? null,
      })) as OrderWithClient[];
    },
  });
}

export function useClientOrders(clientId: string) {
  return useQuery({
    queryKey: ["orders", "client", clientId],
    queryFn: async (): Promise<Order[]> => {
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
    queryFn: async (): Promise<OrderWithClient> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, email")
        .eq("id", (data as Order).client_id)
        .single();

      return {
        ...data,
        client: profile ?? null,
      } as OrderWithClient;
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
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data ?? []) as OrderEvent[];
    },
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status, title, description }: {
      orderId: string;
      status: string;
      title: string;
      description?: string;
    }) => {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);
      if (updateError) throw updateError;

      const { error: eventError } = await supabase
        .from("order_events")
        .insert({
          order_id: orderId,
          status,
          title,
          description: description ?? null,
        });
      if (eventError) throw eventError;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", vars.orderId] });
      queryClient.invalidateQueries({ queryKey: ["order_events", vars.orderId] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: TablesInsert<'orders'>) => {
      const { data, error } = await supabase
        .from("orders")
        .insert(order)
        .select()
        .single();
      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateOrderItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: TablesInsert<'order_items'>) => {
      const { data, error } = await supabase
        .from("order_items")
        .insert(item)
        .select()
        .single();
      if (error) throw error;
      return data as OrderItem;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["order_items", vars.order_id] });
    },
  });
}
