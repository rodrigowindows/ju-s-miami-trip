/**
 * Domains known to block hotlinking or return 403/404.
 */
const BLOCKED_DOMAINS = ["fimgs.net"];

const FALLBACK = "/images/product-placeholder.jpg";

export function fixImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return FALLBACK;

  for (const domain of BLOCKED_DOMAINS) {
    if (url.includes(domain)) {
      return FALLBACK;
    }
  }

  return url;
}
