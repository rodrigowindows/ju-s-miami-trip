import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CheckCircle2, Clock, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { PurchasePhoto } from "@/hooks/usePurchasePhotos";

export default function ShoppingProgress() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["shopping_progress"],
    queryFn: async () => {
      // Active trips
      const { data: trips } = await supabase
        .from("trips")
        .select("id, code, traveler_name, departure_date, status")
        .in("status", ["planejada", "em_andamento"])
        .order("departure_date", { ascending: true });

      if (!trips?.length) return [];

      const results = [];

      for (const trip of trips) {
        const { data: orders } = await supabase
          .from("orders")
          .select("id")
          .eq("trip_id", trip.id)
          .in("status", ["aprovado", "comprando", "comprado"]);

        if (!orders?.length) continue;

        const orderIds = orders.map((o) => o.id);

        const [{ data: items }, { data: photos }] = await Promise.all([
          supabase.from("order_items").select("id, order_id").in("order_id", orderIds),
          supabase.from("purchase_photos" as any).select("order_item_id").in("order_id", orderIds),
        ]);

        const totalItems = items?.length ?? 0;
        const photoItemIds = new Set(
          ((photos ?? []) as unknown as { order_item_id: string | null }[])
            .map((p) => p.order_item_id)
            .filter(Boolean)
        );
        const purchased = photoItemIds.size;

        results.push({
          tripId: trip.id,
          code: trip.code,
          traveler: trip.traveler_name,
          date: trip.departure_date,
          totalItems,
          purchased,
          pending: totalItems - purchased,
          percent: totalItems > 0 ? Math.round((purchased / totalItems) * 100) : 0,
        });
      }

      return results;
    },
  });

  if (isLoading || !data?.length) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          Progresso das Compras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((trip) => (
          <div key={trip.tripId} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">{trip.code}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {trip.traveler} • {new Date(trip.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  {trip.purchased}
                </Badge>
                <Badge variant="outline" className="text-xs gap-1">
                  <Clock className="h-3 w-3 text-amber-500" />
                  {trip.pending}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={trip.percent} className="flex-1 h-2" />
              <span className="text-xs font-semibold text-muted-foreground w-10 text-right">
                {trip.percent}%
              </span>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate("/admin/lista-compras")}
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Abrir Lista de Compras
        </Button>
      </CardContent>
    </Card>
  );
}
