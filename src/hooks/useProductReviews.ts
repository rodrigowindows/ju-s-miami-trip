import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProductReview } from "@/types";

export function useProductReviews(productId: string | null) {
  return useQuery({
    queryKey: ["product_reviews", productId],
    queryFn: async (): Promise<ProductReview[]> => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as ProductReview[];
    },
    enabled: !!productId,
  });
}

export function useCreateProductReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      product_id: string;
      client_id: string;
      rating: number;
      comment?: string;
      reviewer_name: string;
    }) => {
      const { data, error } = await supabase
        .from("product_reviews")
        .insert({
          product_id: review.product_id,
          client_id: review.client_id,
          rating: review.rating,
          comment: review.comment || null,
          reviewer_name: review.reviewer_name,
        })
        .select()
        .single();

      if (error) throw error;
      return data as ProductReview;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["product_reviews", vars.product_id] });
      queryClient.invalidateQueries({ queryKey: ["catalog_products"] });
    },
  });
}
