import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Payment, Order } from "@/lib/types";
import { toast } from "sonner";

export type PaymentWithOrder = Payment & {
  order: Pick<Order, "order_number" | "customer_name"> | null;
};

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async (): Promise<PaymentWithOrder[]> => {
      const { data: payments, error } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (error) throw error;

      const orderIds = [...new Set((payments ?? []).map((p) => p.order_id))];
      if (orderIds.length === 0) return [];

      const { data: orders } = await supabase.from("orders").select("id, order_number, customer_name").in("id", orderIds);
      const orderMap = new Map((orders ?? []).map((o) => [o.id, o]));

      return (payments ?? []).map((p) => ({
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
      const { data, error } = await supabase.from("payments").select("*").eq("order_id", orderId).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Payment[];
    },
    enabled: !!orderId,
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payment: { order_id: string; type: "deposit" | "balance" | "refund"; amount: number; receipt_url?: string | null; notes?: string | null }) => {
      const { data, error } = await supabase.from("payments").insert(payment).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["payments"] });
      qc.invalidateQueries({ queryKey: ["payments", "order", vars.order_id] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pagamento registrado!");
    },
    onError: () => toast.error("Erro ao registrar pagamento."),
  });
}
