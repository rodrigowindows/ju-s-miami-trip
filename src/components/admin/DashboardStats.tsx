import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, DollarSign, Plane, Clock, TrendingUp, Users } from "lucide-react";
import { formatBRL } from "@/lib/format";

export interface DashboardStatsData {
  total: number;
  active: number;
  revenue: number;
  pending: number;
  delivered: number;
  clients: number;
  cancelledCount: number;
}

const STAT_ITEMS: { key: keyof Omit<DashboardStatsData, 'cancelledCount'>; icon: typeof ShoppingBag; label: string; bg: string; iconColor: string; isCurrency?: boolean }[] = [
  { key: "total", icon: ShoppingBag, label: "Total pedidos", bg: "bg-blue-50", iconColor: "text-blue-600" },
  { key: "active", icon: Clock, label: "Ativos", bg: "bg-amber-50", iconColor: "text-amber-600" },
  { key: "revenue", icon: DollarSign, label: "Receita", bg: "bg-green-50", iconColor: "text-green-600", isCurrency: true },
  { key: "pending", icon: Plane, label: "Para orçar", bg: "bg-orange-50", iconColor: "text-orange-600" },
  { key: "delivered", icon: TrendingUp, label: "Entregues", bg: "bg-violet-50", iconColor: "text-violet-600" },
  { key: "clients", icon: Users, label: "Clientes", bg: "bg-sky-50", iconColor: "text-sky-600" },
];

export default function DashboardStats({ stats }: { stats: DashboardStatsData }) {
  const avgTicket = stats.revenue / ((stats.total - stats.cancelledCount) || 1);
  const conversionRate = stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0;

  return (
    <>
      {/* Ticket Médio */}
      {stats.total > 0 && (
        <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200">
          <CardContent className="py-3 px-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-violet-600 font-medium">Ticket Médio</p>
              <p className="text-lg font-bold text-violet-800">{formatBRL(avgTicket)}</p>
            </div>
            <div>
              <p className="text-xs text-violet-600 font-medium">Taxa de Conversão</p>
              <p className="text-lg font-bold text-violet-800">{conversionRate}%</p>
            </div>
            <div>
              <p className="text-xs text-violet-600 font-medium">Pedidos Pendentes</p>
              <p className="text-lg font-bold text-amber-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAT_ITEMS.map((item) => (
          <Card key={item.key}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon size={20} className={item.iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold truncate">
                    {item.isCurrency ? formatBRL(stats[item.key]) : stats[item.key]}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
