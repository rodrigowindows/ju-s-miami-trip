import { useState } from "react";
import { Plane } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { store } from "@/hooks/use-orders-store";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AssignTripDialog({
  orderId,
  currentTripId,
  open,
  onOpenChange,
}: {
  orderId: string;
  currentTripId?: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const trips = store.getTrips();
  const [tripId, setTripId] = useState(currentTripId || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tripId) {
      toast.error("Selecione uma viagem.");
      return;
    }
    store.assignTrip(orderId, tripId);
    toast.success("Viagem atribuída ao pedido!");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atribuir a Viagem</DialogTitle>
          <DialogDescription>Selecione a viagem para este pedido.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Viagem</Label>
            <Select value={tripId} onValueChange={setTripId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar viagem..." />
              </SelectTrigger>
              <SelectContent>
                {trips.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} — {format(new Date(t.departure_date), "dd/MM", { locale: ptBR })} a{" "}
                    {format(new Date(t.return_date), "dd/MM/yyyy", { locale: ptBR })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Plane className="mr-2 h-4 w-4" />
              Atribuir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
