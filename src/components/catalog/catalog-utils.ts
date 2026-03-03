import { LayoutGrid, Smartphone, Sparkles, Shirt, Heart, Truck, Package, Baby, Pill } from "lucide-react";
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
  displayLabel: string;
  icon: LucideIcon;
  /** If true, this is a badge/tag, not a real category filter */
  isBadge?: boolean;
  badgeColor?: string;
}

export const CATEGORY_LIST: CategoryDef[] = [
  { label: "Todos", displayLabel: "Todos", icon: LayoutGrid },
  { label: "Tech", displayLabel: "Tecnologia", icon: Smartphone },
  { label: "Beauty", displayLabel: "Beleza & Cosméticos", icon: Sparkles },
  { label: "Fashion", displayLabel: "Moda & Acessórios", icon: Shirt },
  { label: "Lifestyle", displayLabel: "Casa & Lifestyle", icon: Heart },
  { label: "Kids", displayLabel: "Kids & Brinquedos", icon: Baby },
  { label: "Health", displayLabel: "Saúde & Suplementos", icon: Pill },
  { label: "_frete", displayLabel: "Frete Grátis", icon: Truck, isBadge: true, badgeColor: "emerald" },
  { label: "_pronta", displayLabel: "Pronta Entrega", icon: Package, isBadge: true, badgeColor: "blue" },
];

export const CATEGORIES = CATEGORY_LIST.map((c) => c.label) as readonly string[];

export const SORT_OPTIONS = [
  { value: "relevance", label: "Mais Relevantes" },
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
  { value: "name", label: "Nome A-Z" },
] as const;
