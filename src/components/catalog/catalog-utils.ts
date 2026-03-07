import { LayoutGrid, Smartphone, Sparkles, Shirt, Heart, Package, Baby, Pill } from "lucide-react";
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
  { label: "_pronta", displayLabel: "Pronta Entrega", icon: Package, isBadge: true, badgeColor: "blue" },
];

export const CATEGORIES = CATEGORY_LIST.map((c) => c.label) as readonly string[];

export const SORT_OPTIONS = [
  { value: "relevance", label: "Mais Relevantes" },
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
  { value: "name", label: "Nome A-Z" },
] as const;

/* ── Product Grouping (variants by scent/fragrance) ──────── */

import type { CatalogProduct } from "@/types";

export interface ProductVariant {
  product: CatalogProduct;
  variantName: string;
}

export interface ProductGroup {
  groupName: string;
  variants: ProductVariant[];
}

export type GroupedItem = CatalogProduct | ProductGroup;

export function isProductGroup(item: GroupedItem): item is ProductGroup {
  return "variants" in item && "groupName" in item;
}

function findCommonParts(names: string[]): { prefix: string; suffix: string } {
  if (names.length <= 1) return { prefix: "", suffix: "" };

  let prefixLen = 0;
  const minLen = Math.min(...names.map((n) => n.length));
  for (let i = 0; i < minLen; i++) {
    if (names.every((n) => n[i] === names[0][i])) prefixLen = i + 1;
    else break;
  }

  let suffixLen = 0;
  for (let i = 0; i < minLen - prefixLen; i++) {
    if (names.every((n) => n[n.length - 1 - i] === names[0][names[0].length - 1 - i])) suffixLen = i + 1;
    else break;
  }

  return {
    prefix: names[0].slice(0, prefixLen),
    suffix: suffixLen > 0 ? names[0].slice(names[0].length - suffixLen) : "",
  };
}

/**
 * Groups similar products (same brand, same price, same product type)
 * into a single GroupedItem with variant options.
 * E.g., 14 VS Body Mists become 1 group with 14 scent variants.
 */
export function groupSimilarProducts(products: CatalogProduct[], minGroupSize = 3): GroupedItem[] {
  const byKey = new Map<string, CatalogProduct[]>();
  for (const p of products) {
    const key = `${(p.brand || "").toLowerCase().trim()}|${p.price_usd}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(p);
  }

  const grouped = new Set<string>();
  const groups: ProductGroup[] = [];

  for (const [, items] of byKey) {
    if (items.length < minGroupSize) continue;

    const names = items.map((p) => p.name);
    const { prefix, suffix } = findCommonParts(names);

    if (prefix.trim().length < 5 || suffix.trim().length < 2) continue;

    const variants = items.map((p) => ({
      product: p,
      variantName: p.name.slice(prefix.length, p.name.length - (suffix.length || 0)).trim(),
    }));

    if (!variants.every((v) => v.variantName.length > 0)) continue;

    groups.push({
      groupName: `${prefix.trim()} ${suffix.trim()}`,
      variants: variants.sort((a, b) => a.variantName.localeCompare(b.variantName)),
    });
    items.forEach((p) => grouped.add(p.id));
  }

  // Build result maintaining original order, inserting group at first occurrence
  const result: GroupedItem[] = [];
  const addedGroups = new Set<number>();

  for (const p of products) {
    if (grouped.has(p.id)) {
      const gIdx = groups.findIndex((g) => g.variants.some((v) => v.product.id === p.id));
      if (gIdx >= 0 && !addedGroups.has(gIdx)) {
        result.push(groups[gIdx]);
        addedGroups.add(gIdx);
      }
    } else {
      result.push(p);
    }
  }

  return result;
}
