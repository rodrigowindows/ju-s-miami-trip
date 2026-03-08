import { useState, useRef, useEffect } from "react";
import { ArrowLeft, User, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useChatMessages, useSendMessage, useMarkChatRead } from "@/hooks/useChat";

function timeLabel(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

interface AdminChatViewProps {
  clientId: string;
  clientName: string;
  onBack: () => void;
}

export default function AdminChatView({ clientId, clientName, onBack }: AdminChatViewProps) {
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
