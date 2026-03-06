import { ProductImage } from "./ProductImage";
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
        <button key={p.id} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 text-left" onClick={() => onSelect(p)}>
          <ProductImage src={p.image_url} alt={p.name} brand={p.brand} category={p.category} className="w-10 h-10 rounded object-cover flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{p.name}</p>
            <p className="text-xs text-gray-500 truncate">{p.brand}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
