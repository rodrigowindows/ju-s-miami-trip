import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PurchasePhoto {
  id: string;
  order_id: string;
  order_item_id: string | null;
  photo_url: string;
  store_name: string;
  notes: string | null;
  purchased_at: string;
  created_at: string;
}

export function usePurchasePhotos(orderId?: string) {
  return useQuery({
    queryKey: ["purchase_photos", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_photos" as any)
        .select("*")
        .eq("order_id", orderId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as PurchasePhoto[];
    },
  });
}

export function usePurchasePhotosByTrip(tripId?: string) {
  return useQuery({
    queryKey: ["purchase_photos_trip", tripId],
    enabled: !!tripId,
    queryFn: async () => {
      // Get all orders for this trip
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, status, client_id")
        .eq("trip_id", tripId!);

      if (!orders?.length) return [];

      const orderIds = orders.map((o) => o.id);

      // Get order items
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      // Get purchase photos
      const { data: photos } = await supabase
        .from("purchase_photos" as any)
        .select("*")
        .in("order_id", orderIds);

      return orders.map((order) => ({
        ...order,
        items: (items ?? []).filter((i) => i.order_id === order.id),
        photos: ((photos ?? []) as unknown as PurchasePhoto[]).filter(
          (p) => p.order_id === order.id
        ),
      }));
    },
  });
}

export function useUploadPurchasePhoto() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      orderItemId,
      file,
      storeName,
      notes,
    }: {
      orderId: string;
      orderItemId?: string;
      file: File;
      storeName?: string;
      notes?: string;
    }) => {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${orderId}/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("purchase-photos")
        .upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("purchase-photos")
        .getPublicUrl(path);

      const { error: insertErr } = await supabase
        .from("purchase_photos" as any)
        .insert({
          order_id: orderId,
          order_item_id: orderItemId || null,
          photo_url: urlData.publicUrl,
          store_name: storeName || "",
          notes: notes || null,
        } as any);
      if (insertErr) throw insertErr;

      return urlData.publicUrl;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchase_photos"] });
      qc.invalidateQueries({ queryKey: ["purchase_photos_trip"] });
    },
  });
}
