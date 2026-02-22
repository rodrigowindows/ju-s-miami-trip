import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ShoppingCart,
  FileText,
  CreditCard,
  Plane,
  Camera,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import type { OrderEvent } from "@/data/types";

const eventConfig: Record<string, { icon: typeof Clock; color: string }> = {
  created: { icon: ShoppingCart, color: "text-blue-500 bg-blue-50" },
  quote: { icon: FileText, color: "text-purple-500 bg-purple-50" },
  payment: { icon: CreditCard, color: "text-green-500 bg-green-50" },
  buying: { icon: ShoppingCart, color: "text-amber-500 bg-amber-50" },
  photo: { icon: Camera, color: "text-pink-500 bg-pink-50" },
  transit: { icon: Truck, color: "text-orange-500 bg-orange-50" },
  delivered: { icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  cancelled: { icon: XCircle, color: "text-red-500 bg-red-50" },
  status_change: { icon: RefreshCw, color: "text-indigo-500 bg-indigo-50" },
  trip_assigned: { icon: Plane, color: "text-sky-500 bg-sky-50" },
  file_upload: { icon: Camera, color: "text-pink-500 bg-pink-50" },
};

function getEventConfig(type: string) {
  return eventConfig[type] ?? { icon: Clock, color: "text-gray-500 bg-gray-50" };
}

export default function OrderTimeline({ events }: { events: OrderEvent[] }) {
  if (events.length === 0) {
    return <p className="text-muted-foreground text-sm py-4">Nenhum evento registrado.</p>;
  }

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-5 top-3 bottom-3 w-px bg-border" />

      {events.map((event, idx) => {
        const { icon: Icon, color } = getEventConfig(event.event_type);
        return (
          <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Icon */}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color}`}
            >
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <p className="font-medium text-sm">{event.title}</p>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(event.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-muted-foreground">{event.description}</p>
              )}
              {event.photo_url && (
                <img
                  src={event.photo_url}
                  alt={event.title}
                  className="mt-2 rounded-md max-w-xs max-h-48 object-cover border"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
