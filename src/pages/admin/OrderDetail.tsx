import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Upload, Plane } from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import StatusBadge from "@/components/admin/StatusBadge";
import OrderTimeline from "@/components/admin/OrderTimeline";
import UploadFileDialog from "@/components/admin/UploadFileDialog";
import AssignTripDialog from "@/components/admin/AssignTripDialog";
import ChangeStatusDropdown from "@/components/admin/ChangeStatusDropdown";
import { useOrder } from "@/hooks/use-orders-store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

function formatBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function formatUSD(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const order = useOrder(id!);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [tripOpen, setTripOpen] = useState(false);

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-muted-foreground">Pedido não encontrado.</p>
          <Button asChild variant="outline">
            <Link to="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar aos pedidos
            </Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const totalPaid = order.payments.reduce((s, p) => s + p.amount, 0);
  const remaining = order.total_brl - totalPaid;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to="/admin/orders">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-display">{order.order_number}</h1>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm text-muted-foreground">{order.client.name}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Foto/Nota
            </Button>
            <Button variant="outline" onClick={() => setTripOpen(true)}>
              <Plane className="mr-2 h-4 w-4" />
              Atribuir a Viagem
            </Button>
            <ChangeStatusDropdown orderId={order.id} currentStatus={order.status} />
          </div>
        </div>

        <Separator />

        {/* Items Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Itens do Pedido</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Loja</TableHead>
                  <TableHead className="text-right">USD</TableHead>
                  <TableHead className="text-right">BRL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.store}</TableCell>
                    <TableCell className="text-right">{formatUSD(item.price_usd)}</TableCell>
                    <TableCell className="text-right font-medium">{formatBRL(item.price_brl)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Financial Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Financeiro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Estimado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatBRL(order.total_brl)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Sinal Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{formatBRL(totalPaid)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Saldo Restante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${remaining > 0 ? "text-amber-600" : "text-green-600"}`}>
                  {formatBRL(remaining)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Câmbio Usado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">R$ {order.exchange_rate.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Spread %
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{order.spread}%</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <Card>
            <CardContent className="pt-6">
              <OrderTimeline events={order.events} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <UploadFileDialog orderId={order.id} open={uploadOpen} onOpenChange={setUploadOpen} />
      <AssignTripDialog
        orderId={order.id}
        currentTripId={order.trip_id}
        open={tripOpen}
        onOpenChange={setTripOpen}
      />
    </AdminLayout>
  );
}
