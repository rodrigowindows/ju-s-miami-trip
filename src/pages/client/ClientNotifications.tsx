import { useNavigate } from "react-router-dom";
import { Bell, Package, Tag, Info, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "@/hooks/useNotifications";
import EmptyState from "@/components/shared/EmptyState";
import type { Notification } from "@/types";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function typeIcon(type: string) {
  switch (type) {
    case "order_update":
      return <Package size={18} className="text-blue-500" />;
    case "promo":
      return <Tag size={18} className="text-amber-500" />;
    default:
      return <Info size={18} className="text-gray-400" />;
  }
}

export default function ClientNotifications() {
  const { user } = useAuth();
  const { data: notifications, isLoading } = useNotifications(user?.id ?? "");
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const navigate = useNavigate();

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const handleClick = (n: Notification) => {
    if (!n.read) {
      markAsRead.mutate(n.id);
    }
    if (n.order_id) {
      navigate("/client/orders");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Notificações</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className="text-xs text-muted-foreground"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <EmptyState
          icon="orders"
          title="Nenhuma notificação"
          description="Você será notificado sobre atualizações de pedidos e promoções."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                n.read
                  ? "bg-white border-gray-100"
                  : "bg-blue-50 border-blue-100 hover:bg-blue-100/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{typeIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm leading-tight ${!n.read ? "font-semibold" : "font-medium"} text-gray-900`}>
                      {n.title}
                    </p>
                    <span className="text-[11px] text-gray-400 shrink-0">{timeAgo(n.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
