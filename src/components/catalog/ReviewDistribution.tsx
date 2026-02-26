import { Star } from "lucide-react";

interface ReviewDistributionProps {
  averageRating: number;
  totalReviews: number;
  distribution: number[]; // [5star, 4star, 3star, 2star, 1star] counts
}

export default function ReviewDistribution({ averageRating, totalReviews, distribution }: ReviewDistributionProps) {
  const maxCount = Math.max(...distribution, 1);

  return (
    <div className="flex gap-6 items-start">
      {/* Big average */}
      <div className="text-center shrink-0">
        <p className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
        <div className="flex gap-0.5 justify-center mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">{totalReviews} avaliações</p>
      </div>

      {/* Bar distribution */}
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((stars, idx) => {
          const count = distribution[idx] || 0;
          const pct = totalReviews > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-8 text-right">{stars}★</span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
