import { Star } from "lucide-react";

export function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
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
      <span className="text-xs text-sky-700">{reviews.toLocaleString("pt-BR")}</span>
    </div>
  );
}
