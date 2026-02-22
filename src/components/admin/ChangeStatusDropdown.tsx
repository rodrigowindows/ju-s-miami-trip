import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { store } from "@/hooks/use-orders-store";
import type { OrderStatus } from "@/data/types";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ALL_STATUSES: OrderStatus[] = [
  "Novo",
  "Orçamento",
  "Comprando",
  "Em Trânsito",
  "Entregue",
  "Cancelado",
];

export default function ChangeStatusDropdown({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  function handleChange(newStatus: OrderStatus) {
    if (newStatus === currentStatus) return;
    store.changeOrderStatus(orderId, newStatus);
    toast.success(`Status alterado para "${newStatus}"`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Alterar Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ALL_STATUSES.map((s) => (
          <DropdownMenuItem
            key={s}
            disabled={s === currentStatus}
            onClick={() => handleChange(s)}
          >
            {s}
            {s === currentStatus && (
              <span className="ml-2 text-xs text-muted-foreground">(atual)</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
