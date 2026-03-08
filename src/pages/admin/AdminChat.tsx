import { useState, useEffect } from "react";
import { MessageCircle, Loader2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminChatList } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EmptyState from "@/components/shared/EmptyState";
import AdminChatView from "@/components/admin/AdminChatView";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function AdminChat() {
  const { data: chatList, isLoading } = useAdminChatList();
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const qc = useQueryClient();

  const clientIds = chatList?.map((c) => c.clientId) ?? [];
  const { data: profiles } = useQuery({
    queryKey: ["chat-profiles", clientIds.join(",")],
    queryFn: async () => {
      if (clientIds.length === 0) return new Map<string, string>();
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", clientIds);
      return new Map((data ?? []).map((p) => [p.id, p.full_name || "Cliente"]));
    },
    enabled: clientIds.length > 0,
  });

  useEffect(() => {
    const channel = supabase
      .channel("admin-chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () => {
        qc.invalidateQueries({ queryKey: ["chat"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  if (selectedClient) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        <AdminChatView
          clientId={selectedClient.id}
          clientName={selectedClient.name}
          onBack={() => setSelectedClient(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6" /> Chat ao Vivo
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Conversas com clientes em tempo real</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !chatList?.length ? (
        <EmptyState
          icon="orders"
          title="Nenhuma conversa"
          description="Quando um cliente enviar uma mensagem, ela aparecerá aqui."
        />
      ) : (
        <div className="space-y-2">
          {chatList.map((chat) => {
            const name = profiles?.get(chat.clientId) ?? "Cliente";
            return (
              <Card
                key={chat.clientId}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedClient({ id: chat.clientId, name })}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{name}</span>
                      {chat.unread > 0 && (
                        <Badge className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0">{chat.unread}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {chat.lastMessage.sender_role === "admin" ? "Você: " : ""}
                      {chat.lastMessage.message}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {timeAgo(chat.lastMessage.created_at)}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
