import { useState } from "react";
import { ShoppingBag, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EmptyState from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useCatalogProducts } from "@/hooks/useCatalog";
import { useCreateOrder, useCreateOrderItem } from "@/hooks/useOrders";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/contexts/AuthContext";
import type { CatalogProduct } from "@/lib/types";
import { toast } from "sonner";

const CATEGORIES = ["Todos", "Tech", "Beauty", "Fashion", "Lifestyle"];

export default function ClientCatalog() {
  const [category, setCategory] = useState("Todos");
  const { data: products, isLoading } = useCatalogProducts(category);
  const { data: settings } = useSettings();
  const { user, profile } = useAuth();
  const createOrder = useCreateOrder();
  const createOrderItem = useCreateOrderItem();

  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const [ordering, setOrdering] = useState(false);

  const exchangeRate = Number(settings?.exchange_rate ?? "5.70");
  const spread = Number(settings?.spread_percent ?? "3");

  const calcBRL = (usd: number) => usd * exchangeRate * (1 + spread / 100);

  const handleOrder = async () => {
    if (!user || !profile || !selected) return;
    setOrdering(true);
    try {
      const totalUsd = selected.price_usd;
      const totalBrl = calcBRL(totalUsd);
      const deposit = totalBrl * 0.5;

      const order = await createOrder.mutateAsync({
        client_id: user.id,
        customer_name: profile.full_name ?? "",
        customer_phone: profile.phone ?? undefined,
        items: selected.name,
        total_usd: totalUsd,
        total_brl: totalBrl,
        total_amount: totalBrl,
        deposit_amount: deposit,
      });

      await createOrderItem.mutateAsync({
        order_id: order.id,
        product_name: selected.name,
        store: selected.brand,
        product_image_url: selected.image_url,
        price_usd: totalUsd,
        price_brl: totalBrl,
      });

      setSelected(null);
      toast.success("Pedido criado! Acompanhe em Meus Pedidos.");
    } catch {
      toast.error("Erro ao criar pedido.");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold">Vitrine</h2>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((c) => (
          <Button key={c} variant={category === c ? "default" : "outline"} size="sm" onClick={() => setCategory(c)}>
            {c}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
      ) : (products ?? []).length === 0 ? (
        <EmptyState icon="orders" title="Nenhum produto" description="Novos produtos serão adicionados em breve!" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {(products ?? []).map((p) => (
            <Card key={p.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(p)}>
              <div className="h-32 overflow-hidden">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-3">
                <p className="font-semibold text-sm line-clamp-1">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.brand}</p>
                <p className="font-bold text-primary mt-1">R$ {calcBRL(p.price_usd).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">US$ {p.price_usd.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <img src={selected.image_url} alt={selected.name} className="w-full h-48 object-cover rounded-lg" />
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selected.category}</Badge>
                <span className="text-sm text-muted-foreground">{selected.brand}</span>
              </div>
              {selected.description && <p className="text-sm text-muted-foreground">{selected.description}</p>}
              <div className="bg-muted/50 rounded-lg p-4 space-y-1">
                <div className="flex justify-between"><span className="text-sm">Preço USD</span><span className="font-semibold">US$ {selected.price_usd.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-sm">Câmbio</span><span className="text-sm text-muted-foreground">{exchangeRate.toFixed(2)} + {spread}%</span></div>
                <div className="flex justify-between"><span className="text-sm font-semibold">Preço BRL</span><span className="text-lg font-bold text-primary">R$ {calcBRL(selected.price_usd).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-sm">Sinal (50%)</span><span className="text-sm">R$ {(calcBRL(selected.price_usd) * 0.5).toFixed(2)}</span></div>
              </div>
              <Button onClick={handleOrder} className="w-full" disabled={ordering}>
                <ShoppingBag className="h-4 w-4 mr-2" />{ordering ? "Criando pedido..." : "Quero este produto"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
