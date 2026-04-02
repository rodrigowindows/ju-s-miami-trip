import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  activeCategory: string;
  searchQuery: string;
  sortBy: string;
  availabilityFilter: string;
  minPrice: number;
  maxPrice: number;
  aiSearchIds: string[] | null;
  brandFilter?: string;
  onClearCategory: () => void;
  onClearSearch: () => void;
  onClearSort: () => void;
  onClearAvailability: () => void;
  onClearPrice: () => void;
  onClearAiSearch: () => void;
  onClearBrand?: () => void;
  onClearAll: () => void;
}

const SORT_LABELS: Record<string, string> = {
  price_asc: "Menor preço",
  price_desc: "Maior preço",
  name: "A-Z",
};

const AVAIL_LABELS: Record<string, string> = {
  pronta_entrega: "Pronta Entrega",
  sob_encomenda: "Sob Encomenda",
};

export default function ActiveFilters({
  activeCategory, searchQuery, sortBy, availabilityFilter,
  minPrice, maxPrice, aiSearchIds, brandFilter,
  onClearCategory, onClearSearch, onClearSort,
  onClearAvailability, onClearPrice, onClearAiSearch, onClearBrand, onClearAll,
}: Props) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (activeCategory !== "Todos")
    chips.push({ label: `Categoria: ${activeCategory}`, onRemove: onClearCategory });
  if (searchQuery.trim())
    chips.push({ label: `Busca: "${searchQuery}"`, onRemove: onClearSearch });
  if (sortBy !== "relevance")
    chips.push({ label: `Ordem: ${SORT_LABELS[sortBy] || sortBy}`, onRemove: onClearSort });
  if (availabilityFilter !== "all")
    chips.push({ label: AVAIL_LABELS[availabilityFilter] || availabilityFilter, onRemove: onClearAvailability });
  if (minPrice > 0 || maxPrice > 0) {
    const parts = [];
    if (minPrice > 0) parts.push(`mín R$${minPrice}`);
    if (maxPrice > 0) parts.push(`máx R$${maxPrice}`);
    chips.push({ label: `Preço: ${parts.join(" – ")}`, onRemove: onClearPrice });
  }
  if (brandFilter && brandFilter !== "all")
    chips.push({ label: `Marca: ${brandFilter}`, onRemove: onClearBrand ?? (() => {}) });
  if (aiSearchIds)
    chips.push({ label: "Busca IA", onRemove: onClearAiSearch });

  if (chips.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge
          key={chip.label}
          variant="secondary"
          className="gap-1 pl-2.5 pr-1.5 py-1 text-xs font-medium cursor-pointer hover:bg-destructive/10"
          onClick={chip.onRemove}
        >
          {chip.label}
          <X size={12} className="text-muted-foreground" />
        </Badge>
      ))}
      {chips.length > 1 && (
        <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs h-7 text-muted-foreground hover:text-destructive">
          Limpar todos
        </Button>
      )}
    </div>
  );
}
