import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Payment, Order } from "@/types";

export type PaymentWithOrder = Payment & {
  order: Pick<Order, "order_number" | "customer_name"> | null;
};

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async (): Promise<PaymentWithOrder[]> => {
      const { data: payments, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const orderIds = [...new Set((payments ?? []).map((p: Payment) => p.order_id))];
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, client_id")
        .in("id", orderIds);

      const clientIds = [...new Set((orders ?? []).map((o: { client_id: string }) => o.client_id))];
      let profileMap = new Map<string, string | null>();

      if (clientIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", clientIds);

        profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name]));
      }

      const orderMap = new Map(
        (orders ?? []).map((o: { id: string; order_number: string; client_id: string }) => [
          o.id,
          { order_number: o.order_number, client_name: profileMap.get(o.client_id) ?? null },
        ])
      );

      return (payments ?? []).map((p: Payment) => ({
        ...p,
        order: orderMap.get(p.order_id) ?? null,
      })) as PaymentWithOrder[];
    },
  });
}

export function useOrderPayments(orderId: string) {
  return useQuery({
    queryKey: ["payments", "order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Payment[];
    },
    enabled: !!orderId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payment: {
      order_id: string;
      type: "deposit" | "balance" | "refund";
      amount: number;
      receipt_url?: string | null;
      notes?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("payments")
        .insert(payment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["payments", "order", vars.order_id],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
