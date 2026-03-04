import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EXCHANGE_RATE = 5.8;
const SERVICE_FEE_PERCENT = 45;

const PriceSimulator = () => {
  const [usd, setUsd] = useState("");
  const [result, setResult] = useState<{
    product: number;
    fee: number;
    total: number;
  } | null>(null);

  const calculate = () => {
    const value = parseFloat(usd);
    if (isNaN(value) || value <= 0) return;
    const productBrl = value * EXCHANGE_RATE;
    const fee = productBrl * (SERVICE_FEE_PERCENT / 100);
    setResult({ product: productBrl, fee, total: productBrl + fee });
  };

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <section id="simulador" className="py-24 bg-miami-sand">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-12">
          <span className="font-body text-sm font-semibold tracking-widest uppercase text-miami-pink mb-2 block">
            Calcule seu pedido
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Simulador de preço
          </h2>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Simulação rápida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="font-body text-sm text-muted-foreground block mb-1">
                Valor do produto (USD)
              </label>
              <Input
                type="number"
                placeholder="Ex: 100"
                min="0"
                step="0.01"
                value={usd}
                onChange={(e) => {
                  setUsd(e.target.value);
                  setResult(null);
                }}
                className="font-body rounded-lg"
              />
            </div>
            <Button
              onClick={calculate}
              className="w-full font-body rounded-full"
              size="lg"
            >
              Calcular
            </Button>

            {result && (
              <div className="mt-4 space-y-2 border-t pt-4">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Produto</span>
                  <span>{fmt(result.product)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">
                    Taxa de serviço ({SERVICE_FEE_PERCENT}%)
                  </span>
                  <span>{fmt(result.fee)}</span>
                </div>
                <div className="flex justify-between font-display font-bold text-lg pt-2 border-t">
                  <span>Total estimado</span>
                  <span className="text-primary">{fmt(result.total)}</span>
                </div>
                <p className="font-body text-xs text-muted-foreground text-center mt-2">
                  * Cotação base: 1 USD = R$ {EXCHANGE_RATE.toFixed(2)}. Valor
                  final pode variar.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PriceSimulator;
