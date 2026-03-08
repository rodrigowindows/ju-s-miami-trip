import { useState } from "react";
import { Calculator, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatBRL } from "@/lib/format";

type PriceEstimate = {
  price_usd: number;
  exchange_rate: number;
  price_brl_base: number;
  service_fee_brl: number;
  shipping_fee_brl: number;
  total_brl: number;
  estimated_weight_kg: number;
  breakdown_text: string;
};

export default function AIPriceEstimate({
  productName,
  priceUsd,
  category,
}: {
  productName: string;
  priceUsd: number;
  category?: string;
}) {
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const fetchEstimate = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-price-estimate", {
        body: {
          product_name: productName,
          price_usd: priceUsd,
          category: category ?? "geral",
        },
      });
      if (error) throw error;
      setEstimate(data);
      setShowDetails(true);
    } catch {
      // Use local fallback
      const rate = 5.80 * 1.05;
      const base = priceUsd * rate;
      const service = priceUsd * 0.15 * rate;
      const shipping = 0.5 * 15;
      setEstimate({
        price_usd: priceUsd,
        exchange_rate: rate,
        price_brl_base: Math.round(base * 100) / 100,
        service_fee_brl: Math.round(service * 100) / 100,
        shipping_fee_brl: shipping,
        total_brl: Math.round((base + service + shipping) * 100) / 100,
        estimated_weight_kg: 0.5,
        breakdown_text: "Estimativa calculada localmente",
      });
      setShowDetails(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showDetails) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={fetchEstimate}
        disabled={isLoading}
        className="gap-1.5 text-xs text-primary hover:text-primary"
      >
        {isLoading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Sparkles size={12} />
        )}
        Estimar preço final
      </Button>
    );
  }

  if (!estimate) return null;

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 space-y-2 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-primary">
        <Calculator size={14} />
        Estimativa de Preço Final
      </div>
      <div className="space-y-1 text-muted-foreground">
        <div className="flex justify-between">
          <span>Produto (USD)</span>
          <span>US$ {estimate.price_usd.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Conversão (câmbio {estimate.exchange_rate.toFixed(2)})</span>
          <span>{formatBRL(estimate.price_brl_base)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxa de serviço</span>
          <span>{formatBRL(estimate.service_fee_brl)}</span>
        </div>
        <div className="flex justify-between">
          <span>Frete (~{estimate.estimated_weight_kg.toFixed(1)}kg)</span>
          <span>{formatBRL(estimate.shipping_fee_brl)}</span>
        </div>
        <div className="border-t border-primary/10 pt-1 flex justify-between font-bold text-foreground text-sm">
          <span>Total estimado</span>
          <span className="text-primary">{formatBRL(estimate.total_brl)}</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground italic">
        * Valores estimados. O preço final pode variar conforme câmbio e disponibilidade.
      </p>
    </div>
  );
}
