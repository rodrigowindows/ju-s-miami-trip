import { Link } from "react-router-dom";
import { ShoppingBag, Users, Plane, ArrowRight } from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import { useOrders } from "@/hooks/use-orders-store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export default function Dashboard() {
  const orders = useOrders();
  const active = orders.filter((o) => !["Entregue", "Cancelado"].includes(o.status));
  const totalBrl = orders.reduce((s, o) => s + o.total_brl, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Pedidos
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{orders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pedidos Ativos
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{active.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Faturamento Total
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{formatBRL(totalBrl)}</p>
            </CardContent>
          </Card>
        </div>

        <Button asChild>
          <Link to="/admin/orders">
            Ver Pedidos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </AdminLayout>
  );
}
