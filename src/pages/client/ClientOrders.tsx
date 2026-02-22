import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useClientOrders } from "@/hooks/useOrders";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/types";
import { format } from "date-fns";

export default function ClientOrders() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useClientOrders(user?.id ?? "");
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.whatsapp_number ?? "5561999999999";

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Meus Pedidos</h2>

      {isLoading ? (
        <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
      ) : (orders ?? []).length === 0 ? (
        <EmptyState icon="orders" title="Nenhum pedido ainda" description="Visite a Vitrine para fazer seu primeiro pedido!">
          <Link to="/client/catalog">
            <Button className="mt-2">Ver Vitrine</Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {(orders ?? []).map((o) => (
            <Card key={o.id}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono font-semibold text-sm">{o.order_number}</p>
                  <Badge variant="outline" className={ORDER_STATUS_COLORS[o.status]}>{ORDER_STATUS_LABELS[o.status]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{o.items}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">R$ {(o.total_amount ?? 0).toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(o.created_at), "dd/MM/yy")}</span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de saber sobre o pedido ${o.order_number}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full text-emerald-600">
                      <MessageSquare className="h-4 w-4 mr-1" /> WhatsApp
                    </Button>
                  </a>
                  {o.status === "chegou_brasil" && (
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de agendar a entrega do pedido ${o.order_number}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full">Agendar Entrega</Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
