import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { OrderReview } from "@/types";
import { fetchProfileMapFull } from "@/lib/profileMap";

export type ReviewWithDetails = OrderReview & {
  client: { full_name: string | null; email: string } | null;
  order_number: string | null;
};

/** All reviews for a specific client (keyed by order_id for quick lookup) */
export function useClientReviews(clientId: string) {
  return useQuery({
    queryKey: ["order_reviews", "client", clientId],
    queryFn: async (): Promise<OrderReview[]> => {
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

/** All reviews (admin) with client name and order number */
export function useAllReviews() {
  return useQuery({
    queryKey: ["order_reviews", "all"],
    queryFn: async (): Promise<ReviewWithDetails[]> => {
      const { data: reviews, error } = await supabase
        .from("order_reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!reviews || reviews.length === 0) return [];

      // Fetch client profiles
      const clientIds = [...new Set(reviews.map((r: OrderReview) => r.client_id))];
      const profileMap = await fetchProfileMapFull(clientIds);

      // Fetch order numbers
      const orderIds = reviews.map((r: OrderReview) => r.order_id);
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number")
        .in("id", orderIds);

      const orderMap = new Map((orders ?? []).map((o: { id: string; order_number: string }) => [o.id, o.order_number]));

      return reviews.map((r: OrderReview) => ({
        ...r,
        client: profileMap.get(r.client_id) ?? null,
        order_number: orderMap.get(r.order_id) ?? null,
      }));
    },
  });
}

/** Submit a new review */
export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, clientId, rating, comment }: {
      orderId: string;
      clientId: string;
      rating: number;
      comment?: string;
    }) => {
      const { data, error } = await supabase
        .from("order_reviews")
        .insert({
          order_id: orderId,
          client_id: clientId,
          rating,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as OrderReview;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["order_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["order_reviews", "client", vars.clientId] });
    },
  });
}

/** Delete review (admin) */
export function useDeleteReview() {
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
