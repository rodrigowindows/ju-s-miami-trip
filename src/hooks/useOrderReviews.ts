import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OrderReview = {
  id: string;
  order_id: string;
  client_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type OrderReviewWithDetails = OrderReview & {
  order_number?: string;
  customer_name?: string;
};

/** Fetch reviews for a specific client's orders */
export function useClientOrderReviews(clientId: string) {
  return useQuery({
    queryKey: ["order_reviews", "client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_reviews")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderReview[];
    },
    enabled: !!clientId,
  });
}

/** Fetch all reviews (admin) */
export function useAllOrderReviews() {
  return useQuery({
    queryKey: ["order_reviews", "all"],
    queryFn: async (): Promise<OrderReviewWithDetails[]> => {
      const { data: reviews, error } = await supabase
        .from("order_reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch order details
      const orderIds = [...new Set((reviews ?? []).map((r: OrderReview) => r.order_id))];
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, customer_name")
        .in("id", orderIds);

      const orderMap = new Map((orders ?? []).map((o) => [o.id, o]));

      return (reviews ?? []).map((r: OrderReview) => {
        const order = orderMap.get(r.order_id);
        return {
          ...r,
          order_number: order?.order_number ?? "—",
          customer_name: order?.customer_name ?? "—",
        };
      });
    },
  });
}

/** Create a review */
export function useCreateOrderReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { order_id: string; client_id: string; rating: number; comment?: string }) => {
      const { data, error } = await supabase
        .from("order_reviews")
        .insert({
          order_id: review.order_id,
          client_id: review.client_id,
          rating: review.rating,
          comment: review.comment ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as OrderReview;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["order_reviews"] });
    },
  });
}

/** Delete a review (admin) */
export function useDeleteOrderReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from("order_reviews")
        .delete()
        .eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order_reviews"] });
    },
  });
}
