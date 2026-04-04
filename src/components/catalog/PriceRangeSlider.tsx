import { useState, useMemo, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { DollarSign } from "lucide-react";

interface Props {
  products: { price_usd: number }[];
  convert: (usd: number) => number;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (n: number) => void;
  setMaxPrice: (n: number) => void;
}

export default function PriceRangeSlider({ products, convert, minPrice, maxPrice, setMinPrice, setMaxPrice }: Props) {
  const { floor, ceil } = useMemo(() => {
    if (products.length === 0) return { floor: 0, ceil: 1000 };
    const prices = products.map((p) => convert(p.price_usd));
    return {
      floor: Math.floor(Math.min(...prices) / 10) * 10,
      ceil: Math.ceil(Math.max(...prices) / 10) * 10,
    };
  }, [products, convert]);

  const effectiveMin = minPrice > 0 ? minPrice : floor;
  const effectiveMax = maxPrice > 0 ? maxPrice : ceil;

  const [local, setLocal] = useState<[number, number]>([effectiveMin, effectiveMax]);

  useEffect(() => {
    setLocal([minPrice > 0 ? minPrice : floor, maxPrice > 0 ? maxPrice : ceil]);
  }, [minPrice, maxPrice, floor, ceil]);

  const hasFilter = minPrice > 0 || maxPrice > 0;

  function handleCommit(values: number[]) {
    const [lo, hi] = values;
    if (lo <= floor && hi >= ceil) {
      setMinPrice(0);
      setMaxPrice(0);
    } else {
      setMinPrice(lo);
      setMaxPrice(hi);
    }
  }

  return (
    <div className="flex items-center gap-2 min-w-[200px] max-w-[280px]">
      <DollarSign size={14} className="text-muted-foreground shrink-0" />
      <div className="flex-1 flex flex-col gap-0.5">
        <Slider
          min={floor}
          max={ceil}
          step={10}
          value={local}
          onValueChange={(v) => setLocal(v as [number, number])}
          onValueCommit={handleCommit}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>R${local[0]}</span>
          <span>R${local[1]}</span>
        </div>
      </div>
      {hasFilter && (
        <button
          onClick={() => { setMinPrice(0); setMaxPrice(0); }}
          className="text-[10px] text-destructive hover:underline shrink-0"
        >
          Limpar
        </button>
      )}
    </div>
  );
}
