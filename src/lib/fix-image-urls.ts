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

function normalizeCategory(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeBrand(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function fixImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return "";

  const normalized = url.trim();

  for (const domain of BLOCKED_DOMAINS) {
    if (normalized.includes(domain)) {
      return "";
    }
  }

  if (normalized.includes("m.media-amazon.com") && BROKEN_AMAZON_IMAGE_IDS.some((id) => normalized.includes(id))) {
    return "";
  }

  if (normalized.includes("m.media-amazon.com") && normalized.includes("_SL") && !normalized.includes("_AC_SL")) {
    return normalized.replace(/_SL(\d+)/g, "_AC_SL$1");
  }

  return normalized;
}

/**
 * Generate a resilient fallback image URL for a product.
 * Prefer local category/brand images to avoid remote placeholder failures.
 */
export function getBrandedPlaceholder(brand: string, category: string): string {
  const categoryFallbacks: Record<string, string> = {
    fashion: "/images/products/fashion/nike-air-force-1-07.jpg",
    kids: "/images/products/kids/barbie-dreamhouse.jpg",
    lifestyle: "/images/products/lifestyle/stanley-quencher.jpg",
    health: "/images/products/health/kirkland-fish-oil.jpg",
    supplements: "/images/products/health/kirkland-fish-oil.jpg",
    perfumes: "/images/products/perfumes/dior-sauvage-edt.jpg",
    beauty: "/images/products/lifestyle/bbw-into-the-night-mist.jpg",
    "body mists": "/images/products/vs/vs-bombshell-mist.jpg",
    "body care": "/images/products/lifestyle/bbw-thousand-wishes-cream.jpg",
    kits: "/images/products/vs/vs-bombshell-kit.jpg",
    tech: "/images/products/lifestyle/kindle-paperwhite.jpg",
    "victoria s secret": "/images/products/vs/vs-bombshell-mist.jpg",
  };

  const brandFallbacks: Record<string, string> = {
    "the ordinary": "/images/products/lifestyle/bbw-japanese-cherry-blossom.jpg",
    cerave: "/images/products/health/kirkland-vitamin-d3.jpg",
    olaplex: "/images/products/lifestyle/bbw-into-the-night-mist.jpg",
    "sol de janeiro": "/images/products/lifestyle/bbw-thousand-wishes-cream.jpg",
    "too faced": "/images/products/lifestyle/bbw-into-the-night-mist.jpg",
    mac: "/images/products/lifestyle/bbw-gift-set-champagne-toast.jpg",
    "fenty beauty": "/images/products/lifestyle/bbw-into-the-night-mist.jpg",
  };

  const normalizedCategory = normalizeCategory(category);
  const normalizedBrand = normalizeBrand(brand);

  return categoryFallbacks[normalizedCategory] ?? brandFallbacks[normalizedBrand] ?? FALLBACK;
}
