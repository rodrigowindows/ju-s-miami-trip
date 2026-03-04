/**
 * Maps known broken Unsplash image URLs to working replacements.
 * This fixes products whose database image_url points to deleted/moved Unsplash photos.
 */
const BROKEN_URL_FIXES: Record<string, string> = {
  // BBW Into the Night Mist – original 404
  "photo-1594035910387-fea081dc9b3c": "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&h=600&fit=crop",
  // Cadeirinha Graco 4Ever DLX – original 404
  "photo-1590693563776-79e6b606a642": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=600&fit=crop",
  // Munchkin Miracle 360 Cup – original 404
  "photo-1584839404210-0a41e4791460": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop",
};

export function fixImageUrl(url: string | null | undefined): string {
  if (!url || !url.trim()) return "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=600&fit=crop";

  for (const [brokenId, replacement] of Object.entries(BROKEN_URL_FIXES)) {
    if (url.includes(brokenId)) return replacement;
  }

  return url;
}
