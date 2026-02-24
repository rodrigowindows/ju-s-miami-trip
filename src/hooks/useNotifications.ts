import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Notification } from "@/types";

// NOTE: The "notifications" table does not yet exist in the generated Supabase types.
// We cast through `any` so the typed client doesn't reject the table name at compile time.
// Once a migration creates the table and types are regenerated, remove the `as any` casts.

const fromNotifications = () => (supabase.from as any)("notifications");

export function useNotifications(clientId: string) {
  return useQuery({
    queryKey: ["notifications", clientId],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await fromNotifications()
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Notification[];
    },
    enabled: !!clientId,
  });
}

export function useUnreadCount() {
  const { user } = useAuth();
  const clientId = user?.id;

  return useQuery({
    queryKey: ["notifications", "unread_count", clientId],
    queryFn: async (): Promise<number> => {
      const { count, error } = await fromNotifications()
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId!)
        .eq("read", false);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!clientId,
    refetchInterval: 30_000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await fromNotifications()
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await fromNotifications()
        .update({ read: true })
        .eq("client_id", user.id)
        .eq("read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
