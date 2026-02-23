import { Star } from "lucide-react";

/** Deterministic hash from a string (used for stable fake ratings/badges). */
export function stableHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

export function fakeRating(name: string) {
  const h = stableHash(name);
  return {
    rating: Math.min(3.5 + (h % 15) / 10, 5),
    reviews: 50 + (h % 950),
  };
}

export function isBestSeller(name: string) {
  return stableHash(name) % 4 === 0;
}

export function fakeDiscount(name: string) {
  return 10 + (stableHash(name) % 30);
}

export function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={10}
            className={
              i < full
                ? "fill-amber-400 text-amber-400"
                : i === full && half
                ? "fill-amber-400/50 text-amber-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
      <span className="text-[10px] text-gray-500">{count.toLocaleString("pt-BR")}</span>
    </div>
  );
}
