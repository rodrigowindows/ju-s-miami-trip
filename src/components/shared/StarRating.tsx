import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };

export default function StarRating({ value, onChange, size = "md", readonly = false }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95"
          )}
        >
          <Star
            className={cn(
              sizeMap[size],
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}
