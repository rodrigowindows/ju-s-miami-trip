import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { CatalogProduct } from "@/types";
import { toast } from "sonner";

export function useWishlistIds() {
  const { user } = useAuth();

  return useQuery<string[]>({
    queryKey: ["wishlist_ids", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("client_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.product_id);
    },
  });
}

export function useWishlistProducts() {
  const { user } = useAuth();

  return useQuery<(CatalogProduct & { wishlisted_at: string })[]>({
    queryKey: ["wishlist_products", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id, created_at, catalog_products(*)")
        .eq("client_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? [])
        .filter((r) => r.catalog_products)
        .map((r) => ({
          ...(r.catalog_products as unknown as CatalogProduct),
          wishlisted_at: r.created_at,
        }));
    },
  });
}

export function useToggleWishlist() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, isWished }: { productId: string; isWished: boolean }) => {
      if (!user) throw new Error("Não autenticado");

      if (isWished) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("client_id", user.id)
          .eq("product_id", productId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({ client_id: user.id, product_id: productId });
        if (error) throw error;
      }
    },
    onMutate: async ({ productId, isWished }) => {
      await qc.cancelQueries({ queryKey: ["wishlist_ids", user?.id] });
      const prev = qc.getQueryData<string[]>(["wishlist_ids", user?.id]) ?? [];
      const next = isWished ? prev.filter((id) => id !== productId) : [...prev, productId];
      qc.setQueryData(["wishlist_ids", user?.id], next);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["wishlist_ids", user?.id], ctx.prev);
      toast.error("Erro ao atualizar lista de desejos");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["wishlist_ids", user?.id] });
      qc.invalidateQueries({ queryKey: ["wishlist_products", user?.id] });
    },
  });
}
