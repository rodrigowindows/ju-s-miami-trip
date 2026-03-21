import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Plane, CheckCircle2, Clock, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTrips, useCreateTrip } from "@/hooks/useTrips";
import { useToast } from "@/hooks/use-toast";
import { getWeightStatus } from "@/lib/calculations";
import { supabase } from "@/integrations/supabase/client";
import type { PurchasePhoto } from "@/hooks/usePurchasePhotos";

const Trips = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: trips, isLoading } = useTrips();
  const createTrip = useCreateTrip();
  const [open, setOpen] = useState(false);

  // Fetch shopping progress per trip
  const { data: shoppingProgress } = useQuery({
    queryKey: ["trips_shopping_progress"],
    queryFn: async () => {
      const tripIds = trips?.map((t) => t.id) ?? [];
      if (!tripIds.length) return {};

      const { data: orders } = await supabase
        .from("orders")
        .select("id, trip_id")
        .in("trip_id", tripIds)
        .in("status", ["aprovado", "comprando", "comprado"]);

      if (!orders?.length) return {};

      const orderIds = orders.map((o) => o.id);
      const [{ data: items }, { data: photos }] = await Promise.all([
        supabase.from("order_items").select("id, order_id").in("order_id", orderIds),
        supabase.from("purchase_photos" as any).select("order_item_id, order_id").in("order_id", orderIds),
      ]);

      const result: Record<string, { total: number; purchased: number }> = {};
      for (const tripId of tripIds) {
        const tripOrderIds = orders.filter((o) => o.trip_id === tripId).map((o) => o.id);
        const tripItems = (items ?? []).filter((i) => tripOrderIds.includes(i.order_id));
        const photoItemIds = new Set(
          ((photos ?? []) as unknown as PurchasePhoto[])
            .filter((p) => tripOrderIds.includes(p.order_id) && p.order_item_id)
            .map((p) => p.order_item_id)
        );
        result[tripId] = { total: tripItems.length, purchased: photoItemIds.size };
      }
      return result;
    },
    enabled: !!trips?.length,
  });

  const [form, setForm] = useState({
    code: "",
    traveler_name: "",
    flight_number: "",
    departure_date: "",
    arrival_date: "",
    max_weight_kg: 23,
  });

  const handleCreate = async () => {
    try {
      await createTrip.mutateAsync({
        ...form,
        max_weight_kg: Number(form.max_weight_kg),
      });
      toast({ title: "Viagem criada com sucesso!" });
      setOpen(false);
      setForm({
        code: "",
        traveler_name: "",
        flight_number: "",
        departure_date: "",
        arrival_date: "",
        max_weight_kg: 23,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar viagem";
      toast({ title: "Erro", description: message, variant: "destructive" });
    }
  };

  const getWeightColor = (allocated: number, max: number) => {
    const status = getWeightStatus(allocated, max);
    return status === 'red' ? 'bg-red-500' : status === 'yellow' ? 'bg-yellow-500' : 'bg-green-500';
  };

  const getWeightPct = (allocated: number, max: number) =>
    max > 0 ? Math.min((allocated / max) * 100, 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Viagens</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie viagens e alocacao de pedidos
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus size={16} />
          Nova Viagem
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-20 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips?.map((trip) => (
            <Card
              key={trip.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/admin/trips/${trip.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold font-body">
                    {trip.code}
                  </CardTitle>
                  <Plane size={18} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {trip.traveler_name}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {format(new Date(trip.departure_date + "T12:00:00"), "dd MMM", { locale: ptBR })}
                    {" -> "}
                    {format(new Date(trip.arrival_date + "T12:00:00"), "dd MMM yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Voo: {trip.flight_number}
                </div>

                {/* Weight progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      {trip.allocated_weight_kg.toFixed(1)} / {trip.max_weight_kg} kg
                    </span>
                    <span className="text-muted-foreground">
                      {trip.allocated_items_count} {trip.allocated_items_count === 1 ? "item" : "itens"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getWeightColor(
                        trip.allocated_weight_kg,
                        trip.max_weight_kg
                      )}`}
                      style={{
                        width: `${getWeightPct(
                          trip.allocated_weight_kg,
                          trip.max_weight_kg
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Shopping progress */}
                {shoppingProgress?.[trip.id] && shoppingProgress[trip.id].total > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex items-center gap-1.5 text-xs">
                      <Badge variant="outline" className="text-xs px-1.5 py-0 gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        {shoppingProgress[trip.id].purchased}
                      </Badge>
                      <Badge variant="outline" className="text-xs px-1.5 py-0 gap-1">
                        <Clock className="h-3 w-3 text-amber-500" />
                        {shoppingProgress[trip.id].total - shoppingProgress[trip.id].purchased}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {trips?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhuma viagem cadastrada ainda.
            </div>
          )}
        </div>
      )}

      {/* Create trip dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Viagem</DialogTitle>
            <DialogDescription>
              Preencha os dados da viagem
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Codigo</Label>
                <Input
                  id="code"
                  placeholder="T-044"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="flight">Numero do Voo</Label>
                <Input
                  id="flight"
                  placeholder="AA2198"
                  value={form.flight_number}
                  onChange={(e) =>
                    setForm({ ...form, flight_number: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="traveler">Viajante</Label>
              <Input
                id="traveler"
                placeholder="Nome do viajante"
                value={form.traveler_name}
                onChange={(e) =>
                  setForm({ ...form, traveler_name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure">Data Ida</Label>
                <Input
                  id="departure"
                  type="date"
                  value={form.departure_date}
                  onChange={(e) =>
                    setForm({ ...form, departure_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="arrival">Data Volta</Label>
                <Input
                  id="arrival"
                  type="date"
                  value={form.arrival_date}
                  onChange={(e) =>
                    setForm({ ...form, arrival_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="weight">Peso Maximo (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={form.max_weight_kg}
                onChange={(e) =>
                  setForm({ ...form, max_weight_kg: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                !form.code ||
                !form.traveler_name ||
                !form.flight_number ||
                !form.departure_date ||
                !form.arrival_date ||
                createTrip.isPending
              }
            >
              {createTrip.isPending ? "Criando..." : "Criar Viagem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trips;
