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
 * Generate a resilient fallback image URL for a product.
 * Prefer local category images to avoid remote placeholder failures.
 */
export function getBrandedPlaceholder(_brand: string, category: string): string {
  const categoryFallbacks: Record<string, string> = {
    fashion: "/images/products/fashion/nike-air-force-1-07.jpg",
    kids: "/images/products/kids/barbie-dreamhouse.jpg",
    lifestyle: "/images/products/lifestyle/stanley-quencher.jpg",
    health: "/images/products/health/kirkland-fish-oil.jpg",
    supplements: "/images/products/health/kirkland-fish-oil.jpg",
    perfumes: "/images/products/perfumes/dior-sauvage-edt.jpg",
    tech: "/images/product-placeholder.jpg",
    beauty: "/images/product-placeholder.jpg",
    "victoria's secret": "/images/products/vs/vs-bombshell-mist.jpg",
  };

  const cat = (category || "").toLowerCase();
  return categoryFallbacks[cat] ?? FALLBACK;
}
