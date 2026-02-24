import { Input } from "@/components/ui/input";

interface Props {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (n: number) => void;
  setMaxPrice: (n: number) => void;
}

export default function SearchFilters({ minPrice, maxPrice, setMinPrice, setMaxPrice }: Props) {
  return (
    <div className="bg-white border rounded-lg p-3 flex flex-wrap items-end gap-3">
      <div>
        <label className="text-xs text-gray-600 mb-1 block">Preço mínimo (USD)</label>
        <Input className="w-28 h-8 text-sm" type="number" min={0} value={minPrice || ""} placeholder="0" onChange={(e) => setMinPrice(Number(e.target.value || 0))} />
      </div>
      <div>
        <label className="text-xs text-gray-600 mb-1 block">Preço máximo (USD)</label>
        <Input className="w-28 h-8 text-sm" type="number" min={0} value={maxPrice || ""} placeholder="999" onChange={(e) => setMaxPrice(Number(e.target.value || 0))} />
      </div>
    </div>
  );
}
