import type { CatalogProduct } from "@/types";

interface Props {
  query: string;
  products: CatalogProduct[];
  onSelect: (p: CatalogProduct) => void;
}

export default function SearchAutocomplete({ query, products, onSelect }: Props) {
  if (!query.trim()) return null;
  const q = query.toLowerCase();
  const matches = products.filter((p) => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)).slice(0, 5);
  if (!matches.length) return null;

  return (
    <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-50">
      {matches.map((p) => (
        <button key={p.id} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left" onClick={() => onSelect(p)}>
          <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{p.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{p.brand}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
