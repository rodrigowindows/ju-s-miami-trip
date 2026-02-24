interface Props {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (n: number) => void;
  setMaxPrice: (n: number) => void;
  availability: string;
  setAvailability: (v: "all" | "pronta_entrega" | "sob_encomenda" | "esgotado") => void;
}

export default function SearchFilters({ minPrice, maxPrice, setMinPrice, setMaxPrice, availability, setAvailability }: Props) {
  return (
    <div className="bg-white border rounded-lg p-3 flex flex-wrap items-end gap-2">
      <div>
        <label className="text-xs text-gray-600">Preço mínimo (USD)</label>
        <input className="block border rounded px-2 py-1 text-sm w-28" type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value || 0))} />
      </div>
      <div>
        <label className="text-xs text-gray-600">Preço máximo (USD)</label>
        <input className="block border rounded px-2 py-1 text-sm w-28" type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value || 0))} />
      </div>
      <div>
        <label className="text-xs text-gray-600">Disponibilidade</label>
        <select className="block border rounded px-2 py-1 text-sm" value={availability} onChange={(e) => setAvailability(e.target.value as "all" | "pronta_entrega" | "sob_encomenda" | "esgotado")}>
          <option value="all">Todas</option>
          <option value="pronta_entrega">Pronta Entrega</option>
          <option value="sob_encomenda">Sob Encomenda</option>
          <option value="esgotado">Esgotado</option>
        </select>
      </div>
    </div>
  );
}
