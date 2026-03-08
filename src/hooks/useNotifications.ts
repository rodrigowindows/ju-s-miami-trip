import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import type { Notification } from "@/types";

const db = supabase as any;

export function useNotifications(clientId: string) {
  const qc = useQueryClient();

  // Realtime subscription for notifications
  useEffect(() => {
    if (!clientId) return;
    const channel = supabase
      .channel(`notifications-${clientId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `client_id=eq.${clientId}` },
        () => {
          qc.invalidateQueries({ queryKey: ["notifications", clientId] });
          qc.invalidateQueries({ queryKey: ["notifications", "unread_count", clientId] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [clientId, qc]);

  return useQuery({
    queryKey: ["notifications", clientId],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await db
        .from("notifications")
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
      const { count, error } = await db
        .from("notifications")
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
      const { error } = await db
        .from("notifications")
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
      const { error } = await db
        .from("notifications")
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
