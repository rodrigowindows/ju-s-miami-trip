import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUnreadCount } from "@/hooks/useNotifications";

export default function NotificationBell() {
  const navigate = useNavigate();
  const { data: unreadCount } = useUnreadCount();

  return (
    <button
      onClick={() => navigate("/client/notifications")}
      className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Notificações"
    >
      <Bell className="h-5 w-5" />
      {!!unreadCount && unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
