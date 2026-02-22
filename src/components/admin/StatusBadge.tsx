import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/data/types";

const statusConfig: Record<OrderStatus, { className: string }> = {
  Novo: { className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  Orçamento: { className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
  Comprando: { className: "bg-amber-100 text-amber-800 hover:bg-amber-100" },
  "Em Trânsito": { className: "bg-orange-100 text-orange-800 hover:bg-orange-100" },
  Entregue: { className: "bg-green-100 text-green-800 hover:bg-green-100" },
  Cancelado: { className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] ?? { className: "" };
  return (
    <Badge variant="secondary" className={config.className}>
      {status}
    </Badge>
  );
}
