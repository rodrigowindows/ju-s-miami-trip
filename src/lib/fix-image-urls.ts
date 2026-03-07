/**
 * Domains known to block hotlinking or return 403/404.
 */
const BLOCKED_DOMAINS = [
  "fimgs.net",
  "dior.com",
  "theordinary.com",
  "cerave.com",
  "olaplex.com",
  "toofaced.com",
  "sdcdn.io",       // MAC
  "soldejaneiro.com",
];

const FALLBACK = "/images/product-placeholder.jpg";

export function fixImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return "";

  for (const domain of BLOCKED_DOMAINS) {
    if (url.includes(domain)) {
      return "";
    }
  }

  return url;
}

/**
 * Generate a branded placeholder image URL for a product.
 * Used as onError fallback when the actual image_url fails to load.
 */
export function getBrandedPlaceholder(brand: string, category: string): string {
  const categoryColors: Record<string, { bg: string; fg: string }> = {
    tech: { bg: "333333", fg: "ffffff" },
    perfumes: { bg: "8b5cf6", fg: "ffffff" },
    beauty: { bg: "ec4899", fg: "ffffff" },
    fashion: { bg: "1e3a5f", fg: "ffffff" },
    supplements: { bg: "16a34a", fg: "ffffff" },
    kids: { bg: "f59e0b", fg: "ffffff" },
    lifestyle: { bg: "0ea5e9", fg: "ffffff" },
  };

  const cat = category?.toLowerCase() ?? "";
  const colors = categoryColors[cat] ?? { bg: "f43f5e", fg: "ffffff" };
  const label = encodeURIComponent(brand || "Produto");

  return `https://placehold.co/400x400/${colors.bg}/${colors.fg}?text=${label}&font=poppins`;
}
