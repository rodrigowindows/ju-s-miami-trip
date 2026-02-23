import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const WISHLIST_KEY = "wishlists";

export function useWishlist(clientId: string | undefined) {
  return useQuery<string[]>({
    queryKey: [WISHLIST_KEY, clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("client_id", clientId!);
      if (error) throw error;
      return (data ?? []).map((w) => w.product_id);
    },
  });
}

export function useWishlistProducts(clientId: string | undefined) {
  return useQuery({
    queryKey: [WISHLIST_KEY, "products", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id, created_at, catalog_products(*)")
        .eq("client_id", clientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? [])
        .filter((w: Record<string, unknown>) => w.catalog_products)
        .map((w: Record<string, unknown>) => ({
          product_id: w.product_id as string,
          created_at: w.created_at as string,
          product: w.catalog_products as import("@/types").CatalogProduct,
        }));
    },
  });
}

export function useToggleWishlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clientId,
      productId,
      wishlisted,
    }: {
      clientId: string;
      productId: string;
      wishlisted: boolean;
    }) => {
      if (wishlisted) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("client_id", clientId)
          .eq("product_id", productId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({ client_id: clientId, product_id: productId });
        if (error) throw error;
      }
    },
    onMutate: async ({ clientId, productId, wishlisted }) => {
      await qc.cancelQueries({ queryKey: [WISHLIST_KEY, clientId] });
      const prev = qc.getQueryData<string[]>([WISHLIST_KEY, clientId]);
      qc.setQueryData<string[]>([WISHLIST_KEY, clientId], (old) => {
        if (!old) return wishlisted ? [] : [productId];
        return wishlisted
          ? old.filter((id) => id !== productId)
          : [...old, productId];
      });
      return { prev };
    },
    onError: (_err, { clientId }, context) => {
      if (context?.prev) {
        qc.setQueryData([WISHLIST_KEY, clientId], context.prev);
      }
    },
    onSettled: (_data, _err, { clientId }) => {
      qc.invalidateQueries({ queryKey: [WISHLIST_KEY, clientId] });
    },
  });
}

export function useIsWishlisted(
  productId: string,
  wishlistIds: string[] | undefined
): boolean {
  return (wishlistIds ?? []).includes(productId);
}
