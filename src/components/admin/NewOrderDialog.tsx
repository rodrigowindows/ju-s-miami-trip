import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { store } from "@/hooks/use-orders-store";
import { calcBrl, EXCHANGE_RATE, SPREAD } from "@/data/mock-data";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemDraft {
  name: string;
  store: string;
  price_usd: string;
}

const emptyItem = (): ItemDraft => ({ name: "", store: "", price_usd: "" });

function formatBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export default function NewOrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const clients = store.getClients();
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([emptyItem()]);

  function addItem() {
    setItems([...items, emptyItem()]);
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof ItemDraft, value: string) {
    setItems(items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) {
      toast.error("Selecione um cliente.");
      return;
    }
    const validItems = items.filter((it) => it.name && it.store && Number(it.price_usd) > 0);
    if (validItems.length === 0) {
      toast.error("Adicione pelo menos um item válido.");
      return;
    }

    const order = store.createOrder(
      clientId,
      validItems.map((it) => ({
        name: it.name,
        store: it.store,
        price_usd: Number(it.price_usd),
      }))
    );

    toast.success(`Pedido ${order.order_number} criado!`);
    onOpenChange(false);
    setClientId("");
    setItems([emptyItem()]);
    navigate(`/admin/orders/${order.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
          <DialogDescription>
            Selecione o cliente e adicione os itens. O preço BRL é calculado automaticamente
            (USD × {EXCHANGE_RATE} × {(1 + SPREAD / 100).toFixed(2)}).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client */}
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecionar cliente..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <Label>Itens</Label>
            {items.map((item, idx) => {
              const usdVal = Number(item.price_usd) || 0;
              const brlVal = usdVal > 0 ? calcBrl(usdVal) : 0;
              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_100px_100px_40px] gap-2 items-end rounded-md border p-3"
                >
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Nome do produto</Label>
                    <Input
                      placeholder="Ex: iPhone 15 Pro"
                      value={item.name}
                      onChange={(e) => updateItem(idx, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Loja</Label>
                    <Input
                      placeholder="Ex: Apple Store"
                      value={item.store}
                      onChange={(e) => updateItem(idx, "store", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">USD</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={item.price_usd}
                      onChange={(e) => updateItem(idx, "price_usd", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">BRL</Label>
                    <div className="h-10 flex items-center text-sm font-medium text-muted-foreground px-2 bg-muted rounded-md">
                      {brlVal > 0 ? formatBRL(brlVal) : "—"}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    disabled={items.length <= 1}
                    onClick={() => removeItem(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar item
            </Button>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium">Total estimado:</span>
            <span className="text-lg font-bold">
              {formatBRL(
                items.reduce((sum, it) => {
                  const usd = Number(it.price_usd) || 0;
                  return sum + (usd > 0 ? calcBrl(usd) : 0);
                }, 0)
              )}
            </span>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Pedido</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
