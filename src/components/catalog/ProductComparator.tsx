import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import type { CatalogProduct } from "@/types";

interface Props {
  products: CatalogProduct[];
  calcBrl?: (usd: number) => number;
}

export default function ProductComparator({ products, calcBrl }: Props) {
  const [selected, setSelected] = useState<CatalogProduct[]>([]);
  const [comparison, setComparison] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  function toggle(product: CatalogProduct) {
    setSelected((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 3) { toast({ title: "Máximo de 3 produtos para comparar" }); return prev; }
      return [...prev, product];
    });
    setComparison(null);
  }

  function isSelected(id: string) { return selected.some((p) => p.id === id); }

  async function compare() {
    if (selected.length < 2) { toast({ title: "Selecione ao menos 2 produtos" }); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-compare-products", {
        body: { products: selected.map((p) => ({ name: p.name, brand: p.brand, price_usd: p.price_usd, category: p.category })) },
      });
      if (error) throw error;
      setComparison(data?.comparison || "Erro ao gerar comparação.");
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground">Comparar:</span>
          {selected.map((p) => (
            <Badge key={p.id} variant="secondary" className="gap-1 pr-1">
              {p.name.slice(0, 25)}{p.name.length > 25 ? "…" : ""}
              <button onClick={() => toggle(p)} className="ml-1 hover:text-destructive"><X size={12} /></button>
            </Badge>
          ))}
          <Button size="sm" onClick={compare} disabled={loading || selected.length < 2} className="gap-1 h-7 text-xs">
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {loading ? "Comparando..." : "Comparar com IA"}
          </Button>
        </div>
      )}

      {/* Comparison result */}
      {comparison && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles size={14} className="text-primary" /> Comparação IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{comparison}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export { type Props as ProductComparatorProps };
export { ProductComparator };
