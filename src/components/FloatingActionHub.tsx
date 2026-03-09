import { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useClientUnreadChat } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import AIChatWidget from "./AIChatWidget";

export default function FloatingActionHub() {
  useNotificationSound();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const { data: settings } = useSettings();
  const { track } = useAnalytics();
  const { user } = useAuth();

  const { data: unreadNotifications = 0 } = useUnreadCount();
  const { data: unreadChat = 0 } = useClientUnreadChat(user?.id ?? "");

  const totalUnread = unreadNotifications + unreadChat;

  // Hide on admin pages
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) return null;

  const number = settings?.whatsapp_number ?? "5561999999999";
  const message = encodeURIComponent("Olá! Vim pelo site e gostaria de saber mais sobre os produtos.");
  const waUrl = `https://wa.me/${number}?text=${message}`;

  if (aiChatOpen) {
    return <AIChatWidget onClose={() => setAiChatOpen(false)} />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[1001] flex flex-col items-end gap-3">
      {/* Expanded options */}
      {menuOpen && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
          {/* AI Chat option */}
          <button
            onClick={() => {
              setMenuOpen(false);
              setAiChatOpen(true);
            }}
            className="flex items-center gap-2 bg-primary text-primary-foreground rounded-full pl-4 pr-5 py-2.5 shadow-lg hover:scale-105 transition-transform text-sm font-medium"
            aria-label="Abrir assistente IA"
          >
            <Sparkles size={18} />
            <span>Assistente IA</span>
          </button>

          {/* WhatsApp option */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track("whatsapp_click", { page_path: window.location.pathname });
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 bg-success text-success-foreground rounded-full pl-4 pr-5 py-2.5 shadow-lg hover:scale-105 transition-transform text-sm font-medium"
            aria-label="Fale conosco pelo WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      )}

      {/* Main FAB button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${
          menuOpen
            ? "bg-muted text-muted-foreground rotate-45"
            : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground animate-subtle-bounce"
        }`}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu de ajuda"}
      >
        {menuOpen ? <X size={24} /> : <MessageCircle size={24} />}

        {/* Unread badge */}
        {totalUnread > 0 && !menuOpen && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-1 shadow-md animate-in zoom-in-50 duration-200">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>
    </div>
  );
}
