import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader2, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminChatList, useChatMessages, useSendMessage, useMarkChatRead } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import EmptyState from "@/components/shared/EmptyState";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function timeLabel(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function ChatView({ clientId, clientName, onBack }: { clientId: string; clientName: string; onBack: () => void }) {
  const { user } = useAuth();
  const { data: messages, isLoading } = useChatMessages(clientId);
  const sendMessage = useSendMessage();
  const markRead = useMarkChatRead();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clientId && messages?.some((m) => m.sender_role === "client" && !m.read)) {
      markRead.mutate({ clientId, role: "admin" });
    }
  }, [clientId, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !user) return;
    sendMessage.mutate({
      client_id: clientId,
      sender_role: "admin",
      sender_id: user.id,
      message: trimmed,
    });
    setText("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex items-center gap-3 pb-3 border-b">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">{clientName}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : !messages?.length ? (
          <p className="text-center text-muted-foreground text-sm py-10">Nenhuma mensagem ainda.</p>
        ) : (
          messages.map((msg) => {
            const isAdmin = msg.sender_role === "admin";
            return (
              <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"} mb-1`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                    isAdmin
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                  <p className={`text-[10px] mt-0.5 ${isAdmin ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {timeLabel(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t pt-3 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Responder..."
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!text.trim() || sendMessage.isPending} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminChat() {
  const { data: chatList, isLoading } = useAdminChatList();
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const qc = useQueryClient();

  // Fetch profile names for chat list
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

  // Realtime for admin
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
        <ChatView
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
                        <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0">{chat.unread}</Badge>
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
