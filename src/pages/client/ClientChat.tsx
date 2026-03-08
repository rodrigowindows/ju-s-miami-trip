import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useChatMessages, useSendMessage, useMarkChatRead } from "@/hooks/useChat";
import EmptyState from "@/components/shared/EmptyState";

function timeLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function dateLabel(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Hoje";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function ClientChat() {
  const { user } = useAuth();
  const clientId = user?.id ?? "";
  const { data: messages, isLoading } = useChatMessages(clientId);
  const sendMessage = useSendMessage();
  const markRead = useMarkChatRead();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mark admin messages as read
  useEffect(() => {
    if (clientId && messages?.some((m) => m.sender_role === "admin" && !m.read)) {
      markRead.mutate({ clientId, role: "client" });
    }
  }, [clientId, messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !user) return;
    sendMessage.mutate({
      client_id: clientId,
      sender_role: "client",
      sender_id: user.id,
      message: trimmed,
    });
    setText("");
  };

  // Group messages by date
  let lastDate = "";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center gap-2 pb-3 border-b">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">Chat com Suporte</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {!messages || messages.length === 0 ? (
          <EmptyState
            icon="orders"
            title="Nenhuma mensagem"
            description="Envie uma mensagem para iniciar a conversa com nosso suporte."
          />
        ) : (
          messages.map((msg) => {
            const currentDate = dateLabel(msg.created_at);
            const showDate = currentDate !== lastDate;
            lastDate = currentDate;
            const isMe = msg.sender_role === "client";

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex justify-center my-3">
                    <span className="text-[11px] text-muted-foreground bg-muted px-3 py-0.5 rounded-full">
                      {currentDate}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    <p className={`text-[10px] mt-0.5 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {timeLabel(msg.created_at)}
                    </p>
                  </div>
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
          placeholder="Digite sua mensagem..."
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={!text.trim() || sendMessage.isPending} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
