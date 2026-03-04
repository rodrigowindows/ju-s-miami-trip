/**
 * Domains known to block hotlinking or return 403/404.
 * Redirect these to a generic perfume placeholder.
 */
const BLOCKED_DOMAINS = ["fimgs.net"];

const FALLBACK = "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=600&fit=crop";

export function fixImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return FALLBACK;

  // Replace URLs from domains that block hotlinking
  for (const domain of BLOCKED_DOMAINS) {
    if (url.includes(domain)) {
      return "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop";
    }
  }

  return url;
}
