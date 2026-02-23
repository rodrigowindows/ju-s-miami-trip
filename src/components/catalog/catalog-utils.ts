import { LayoutGrid, Smartphone, Sparkles, Shirt, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Deterministic fake rating based on product name hash */
export function fakeRating(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  const rating = 3.5 + (Math.abs(hash) % 15) / 10;
  const reviews = 50 + (Math.abs(hash) % 950);
  return { rating: Math.min(rating, 5), reviews };
}

/** Deterministic "best seller" flag based on product name hash */
export function isBestSeller(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return Math.abs(hash) % 4 === 0;
}

/** Fake previous price for "discount" display */
export function fakePreviousPrice(brl: number, name: string) {
  return brl * (1 + (Math.abs(name.charCodeAt(0)) % 30 + 10) / 100);
}

export interface CategoryDef {
  label: string;
  icon: LucideIcon;
}

export const CATEGORY_LIST: CategoryDef[] = [
  { label: "Todos", icon: LayoutGrid },
  { label: "Tech", icon: Smartphone },
  { label: "Beauty", icon: Sparkles },
  { label: "Fashion", icon: Shirt },
  { label: "Lifestyle", icon: Heart },
];

export const CATEGORIES = CATEGORY_LIST.map((c) => c.label) as readonly string[];

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevância" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "name", label: "A-Z" },
] as const;
