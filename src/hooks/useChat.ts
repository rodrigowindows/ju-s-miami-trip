import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const db = supabase as any;

export type ChatMessage = {
  id: string;
  client_id: string;
  sender_role: "client" | "admin";
  sender_id: string;
  message: string;
  read: boolean;
  created_at: string;
};

export function useChatMessages(clientId: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["chat", clientId],
    queryFn: async (): Promise<ChatMessage[]> => {
      const { data, error } = await db
        .from("chat_messages")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ChatMessage[];
    },
    enabled: !!clientId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!clientId) return;
    const channel = supabase
      .channel(`chat-${clientId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_messages", filter: `client_id=eq.${clientId}` },
        () => {
          qc.invalidateQueries({ queryKey: ["chat", clientId] });
          qc.invalidateQueries({ queryKey: ["chat", "unread"] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [clientId, qc]);

  return query;
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { client_id: string; sender_role: "client" | "admin"; sender_id: string; message: string }) => {
      const { error } = await db.from("chat_messages").insert(input);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["chat", vars.client_id] });
      qc.invalidateQueries({ queryKey: ["chat", "unread"] });
    },
  });
}

export function useMarkChatRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ clientId, role }: { clientId: string; role: "client" | "admin" }) => {
      const oppositeRole = role === "client" ? "admin" : "client";
      const { error } = await db
        .from("chat_messages")
        .update({ read: true })
        .eq("client_id", clientId)
        .eq("sender_role", oppositeRole)
        .eq("read", false);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["chat", vars.clientId] });
      qc.invalidateQueries({ queryKey: ["chat", "unread"] });
    },
  });
}

/** Admin: get all clients with unread messages */
export function useAdminChatList() {
  return useQuery({
    queryKey: ["chat", "admin-list"],
    queryFn: async () => {
      // Get latest message per client
      const { data, error } = await db
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const messages = (data ?? []) as ChatMessage[];
      const clientMap = new Map<string, { lastMessage: ChatMessage; unread: number }>();

      for (const msg of messages) {
        const existing = clientMap.get(msg.client_id);
        if (!existing) {
          clientMap.set(msg.client_id, {
            lastMessage: msg,
            unread: msg.sender_role === "client" && !msg.read ? 1 : 0,
          });
        } else {
          if (msg.sender_role === "client" && !msg.read) {
            existing.unread++;
          }
        }
      }

      return Array.from(clientMap.entries()).map(([clientId, data]) => ({
        clientId,
        ...data,
      }));
    },
  });
}

export function useClientUnreadChat(clientId: string) {
  return useQuery({
    queryKey: ["chat", "unread", clientId],
    queryFn: async (): Promise<number> => {
      const { count, error } = await db
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .eq("sender_role", "admin")
        .eq("read", false);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!clientId,
    refetchInterval: 30_000,
  });
}
