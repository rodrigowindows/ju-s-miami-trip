import { ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useCatalogProducts } from "@/hooks/useCatalog";

export default function AdminCatalog() {
  const { data: products, isLoading } = useCatalogProducts();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Catálogo</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : (products ?? []).length === 0 ? (
        <EmptyState icon="orders" title="Catálogo vazio" description="Adicione produtos via Supabase." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(products ?? []).map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.brand}</p>
                  </div>
                  <Badge variant="outline">{p.category}</Badge>
                </div>
                <p className="text-lg font-bold text-primary">US$ {p.price_usd.toFixed(2)}</p>
                {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
