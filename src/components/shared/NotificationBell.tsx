import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Package, ShoppingBag, Tag, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  type Notification,
} from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function notifIcon(type: string) {
  switch (type) {
    case "order_status": return <Package size={16} className="text-blue-600" />;
    case "new_order": return <ShoppingBag size={16} className="text-green-600" />;
    case "promo": return <Tag size={16} className="text-orange-600" />;
    default: return <Info size={16} className="text-muted-foreground" />;
  }
}

export default function NotificationBell() {
  const { user, isAdmin } = useAuth();
  const { data: notifications = [] } = useNotifications(user?.id);
  const { data: unreadCount = 0 } = useUnreadCount(user?.id);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleClick(notif: Notification) {
    if (!notif.read) {
      markAsRead.mutate(notif.id);
    }
    setOpen(false);
    if (notif.order_id) {
      navigate(isAdmin ? `/admin/orders/${notif.order_id}` : `/client/orders/${notif.order_id}`);
    }
  }

  function handleMarkAll() {
    if (user?.id) markAllAsRead.mutate(user.id);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Notificações"
      >
        <Bell size={20} className="text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[70vh] bg-card border rounded-xl shadow-lg z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <CheckCheck size={14} />
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell size={28} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={cn(
                    "w-full text-left px-4 py-3 flex gap-3 hover:bg-muted/60 transition-colors border-b last:border-b-0",
                    !notif.read && "bg-primary/5"
                  )}
                >
                  <div className="mt-0.5 shrink-0">
                    {notifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm leading-tight", !notif.read && "font-semibold")}>
                      {notif.title}
                    </p>
                    {notif.body && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(notif.created_at)}</p>
                  </div>
                  {!notif.read && (
                    <div className="mt-1.5 shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
