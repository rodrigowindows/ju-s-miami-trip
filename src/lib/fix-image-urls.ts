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

/**
 * Amazon image IDs that consistently return 404 in runtime logs.
 */
const BROKEN_AMAZON_IMAGE_IDS = [
  "51kz4YS0YTL",
  "71pS9HxGRcL",
  "71f5VHnVW6L",
  "51vqzQPZ5cL",
  "71fqJpCxXzL",
  "71xj-TCDTPL",
  "71VPNszcg5L",
  "71TLCZkfWGL",
  "71pzKsBx7kL",
  "51gKC3jIURL",
  "61mOVWVcYqL",
  "71SLhR8mekL",
  "61wHdPGb3gL",
  "61mVEzHgPWL",
  "61RYVcxKvJL",
  "71PKSNGfXHL",
  "61nWNqEOmSL",
];

export function fixImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return "";

  for (const domain of BLOCKED_DOMAINS) {
    if (url.includes(domain)) {
      return "";
    }
  }

  if (url.includes("m.media-amazon.com") && BROKEN_AMAZON_IMAGE_IDS.some((id) => url.includes(id))) {
    return "";
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
