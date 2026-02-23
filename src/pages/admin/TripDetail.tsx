import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Plus, Plane } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useTrip,
  useUnassignedOrders,
  useAllocateOrder,
  useUpdateTrip,
  useDeleteTrip,
} from "@/hooks/useTrips";
import { useToast } from "@/hooks/use-toast";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, isLoading } = useTrip(id!);
  const { data: unassigned } = useUnassignedOrders();
  const allocateOrder = useAllocateOrder();
  const updateTrip = useUpdateTrip();
  const deleteTrip = useDeleteTrip();

  const [allocateOpen, setAllocateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    code: "",
    traveler_name: "",
    flight_number: "",
    departure_date: "",
    arrival_date: "",
    max_weight_kg: 23,
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto text-center">
        <p className="text-muted-foreground">Viagem não encontrada.</p>
        <Button variant="link" onClick={() => navigate("/admin/trips")}>Voltar</Button>
      </div>
    );
  }

  const { trip, orders } = data;
  const pct = trip.max_weight_kg > 0 ? (trip.allocated_weight_kg / trip.max_weight_kg) * 100 : 0;
  const barColor = pct > 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500";
  const canDelete = orders.length === 0;

  const openEdit = () => {
    setEditForm({
      code: trip.code,
      traveler_name: trip.traveler_name,
      flight_number: trip.flight_number,
      departure_date: trip.departure_date,
      arrival_date: trip.arrival_date,
      max_weight_kg: trip.max_weight_kg,
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await updateTrip.mutateAsync({ id: trip.id, ...editForm, max_weight_kg: Number(editForm.max_weight_kg) });
      toast({ title: "Viagem atualizada!" });
      setEditOpen(false);
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrip.mutateAsync(trip.id);
      toast({ title: "Viagem excluída!" });
      navigate("/admin/trips");
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleAllocate = async (orderId: string) => {
    try {
      await allocateOrder.mutateAsync({ orderId, tripId: trip.id });
      toast({ title: "Pedido alocado com sucesso!" });
      setAllocateOpen(false);
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao alocar", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2" onClick={() => navigate("/admin/trips")}>
          <ArrowLeft size={16} /> Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={openEdit}>
            <Edit2 size={14} /> Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive" disabled={!canDelete}>
                <Trash2 size={14} /> Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir viagem?</AlertDialogTitle>
                <AlertDialogDescription>
                  {canDelete ? "Esta ação não pode ser desfeita." : "Remova todos os pedidos alocados antes de excluir."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                {canDelete && <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Trip info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Plane size={24} className="text-primary" />
            <div>
              <CardTitle className="text-xl">{trip.code}</CardTitle>
              <p className="text-sm text-muted-foreground">{trip.traveler_name}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">Voo</span>
              <span className="font-medium">{trip.flight_number}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Ida</span>
              <span className="font-medium">
                {format(new Date(trip.departure_date + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Volta</span>
              <span className="font-medium">
                {format(new Date(trip.arrival_date + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Capacidade</span>
              <span className="text-muted-foreground">
                {trip.allocated_weight_kg.toFixed(1)} / {trip.max_weight_kg} kg ({pct.toFixed(0)}%)
              </span>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocated orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pedidos Alocados ({orders.length})</CardTitle>
            <Button size="sm" className="gap-2" onClick={() => setAllocateOpen(true)}>
              <Plus size={14} /> Alocar Pedido
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum pedido alocado nesta viagem.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Peso Est.</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                    <TableCell className="font-mono font-medium">{order.order_number}</TableCell>
                    <TableCell>{order.client_name ?? "—"}</TableCell>
                    <TableCell>{order.estimated_weight_kg ? `${order.estimated_weight_kg} kg` : "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ORDER_STATUS_LABELS[order.status] ?? order.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Allocate order dialog */}
      <Dialog open={allocateOpen} onOpenChange={setAllocateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alocar Pedido</DialogTitle>
            <DialogDescription>Selecione um pedido sem viagem atribuída</DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {unassigned && unassigned.length > 0 ? (
              unassigned.map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleAllocate(order.id)}
                  disabled={allocateOrder.isPending}
                  className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-sm">{order.order_number}</span>
                      <span className="text-muted-foreground text-sm ml-2">{order.client_name ?? ""}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {order.estimated_weight_kg ? `${order.estimated_weight_kg} kg` : "Peso N/A"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{order.items ?? ""}</p>
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhum pedido disponível para alocação.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit trip dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Viagem</DialogTitle>
            <DialogDescription>Atualize os dados da viagem</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Código</Label><Input value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} /></div>
              <div><Label>Voo</Label><Input value={editForm.flight_number} onChange={(e) => setEditForm({ ...editForm, flight_number: e.target.value })} /></div>
            </div>
            <div><Label>Viajante</Label><Input value={editForm.traveler_name} onChange={(e) => setEditForm({ ...editForm, traveler_name: e.target.value })} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Data Ida</Label><Input type="date" value={editForm.departure_date} onChange={(e) => setEditForm({ ...editForm, departure_date: e.target.value })} /></div>
              <div><Label>Data Volta</Label><Input type="date" value={editForm.arrival_date} onChange={(e) => setEditForm({ ...editForm, arrival_date: e.target.value })} /></div>
            </div>
            <div><Label>Peso Máximo (kg)</Label><Input type="number" value={editForm.max_weight_kg} onChange={(e) => setEditForm({ ...editForm, max_weight_kg: Number(e.target.value) })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdate} disabled={updateTrip.isPending}>{updateTrip.isPending ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripDetail;
