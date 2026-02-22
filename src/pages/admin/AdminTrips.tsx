import { useState } from "react";
import { Plus, Plane, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/LoadingSkeleton";
import { useTrips, useCreateTrip, useDeleteTrip } from "@/hooks/useTrips";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminTrips() {
  const { data: trips, isLoading } = useTrips();
  const createTrip = useCreateTrip();
  const deleteTrip = useDeleteTrip();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", traveler_name: "", flight_number: "", departure_date: "", arrival_date: "", max_weight_kg: "23" });

  const handleCreate = () => {
    if (!form.code || !form.traveler_name || !form.departure_date || !form.arrival_date) { toast.error("Preencha todos os campos"); return; }
    createTrip.mutate({ ...form, max_weight_kg: Number(form.max_weight_kg) }, {
      onSuccess: () => { setOpen(false); setForm({ code: "", traveler_name: "", flight_number: "", departure_date: "", arrival_date: "", max_weight_kg: "23" }); },
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir esta viagem?")) return;
    deleteTrip.mutate(id);
  };

  const weightColor = (pct: number) => pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Viagens</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Nova Viagem</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Viagem</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Código</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="MIAMI-2026-03" /></div>
              <div><Label>Viajante</Label><Input value={form.traveler_name} onChange={(e) => setForm({ ...form, traveler_name: e.target.value })} /></div>
              <div><Label>Voo</Label><Input value={form.flight_number} onChange={(e) => setForm({ ...form, flight_number: e.target.value })} placeholder="AA930" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Ida</Label><Input type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} /></div>
                <div><Label>Volta</Label><Input type="date" value={form.arrival_date} onChange={(e) => setForm({ ...form, arrival_date: e.target.value })} /></div>
              </div>
              <div><Label>Peso Máx. (kg)</Label><Input type="number" value={form.max_weight_kg} onChange={(e) => setForm({ ...form, max_weight_kg: e.target.value })} /></div>
              <Button onClick={handleCreate} className="w-full" disabled={createTrip.isPending}>{createTrip.isPending ? "Criando..." : "Criar Viagem"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <TableSkeleton rows={3} cols={5} /> : (trips ?? []).length === 0 ? (
        <EmptyState icon="trips" title="Nenhuma viagem" description="Crie uma viagem para começar a alocar pedidos." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(trips ?? []).map((t) => {
            const pct = t.max_weight_kg > 0 ? (t.allocated_weight_kg / t.max_weight_kg) * 100 : 0;
            return (
              <Card key={t.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><Plane className="h-4 w-4" /> {t.code}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="h-8 w-8 text-muted-foreground hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Viajante:</span> {t.traveler_name}</p>
                    <p><span className="text-muted-foreground">Voo:</span> {t.flight_number}</p>
                    <p><span className="text-muted-foreground">Ida:</span> {format(new Date(t.departure_date), "dd/MM/yyyy")}</p>
                    <p><span className="text-muted-foreground">Volta:</span> {format(new Date(t.arrival_date), "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{t.allocated_weight_kg.toFixed(1)} kg / {t.max_weight_kg} kg</span>
                      <span>{t.allocated_items_count} pedidos</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${weightColor(pct)}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
