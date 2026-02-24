import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface Props {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (n: number) => void;
  setMaxPrice: (n: number) => void;
}

export default function SearchFilters({ minPrice, maxPrice, setMinPrice, setMaxPrice }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasFilters = minPrice > 0 || maxPrice > 0;

  function clearFilters() {
    setMinPrice(0);
    setMaxPrice(0);
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gray-500" />
          <span>Filtros de preço</span>
          {hasFilters && (
            <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              Ativo
            </span>
          )}
        </div>
        <span className="text-gray-400 text-xs">{expanded ? "Fechar" : "Abrir"}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t pt-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[100px]">
              <label className="text-xs text-gray-500 mb-1 block font-medium">Mín (USD)</label>
              <Input
                className="h-9 text-sm"
                type="number"
                min={0}
                value={minPrice || ""}
                placeholder="0"
                onChange={(e) => setMinPrice(Number(e.target.value || 0))}
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="text-xs text-gray-500 mb-1 block font-medium">Máx (USD)</label>
              <Input
                className="h-9 text-sm"
                type="number"
                min={0}
                value={maxPrice || ""}
                placeholder="999"
                onChange={(e) => setMaxPrice(Number(e.target.value || 0))}
              />
            </div>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-1 text-gray-500 hover:text-red-600 h-9"
              >
                <X size={14} /> Limpar
              </Button>
            )}
          </div>
          {minPrice > 0 && maxPrice > 0 && minPrice > maxPrice && (
            <p className="text-xs text-red-500 mt-2">Preço mínimo não pode ser maior que o máximo.</p>
          )}
        </div>
      )}
    </div>
  );
}
