import { TrendingDown } from "lucide-react";
import { formatBRL } from "@/lib/format";
import { getMLComparison } from "@/lib/ml-prices";

interface SavingsBadgeProps {
  brlPrice: number;
  brand: string;
  category: string;
  compact?: boolean;
}

/**
 * Shows a savings badge comparing our price to estimated ML price.
 * Returns null when no meaningful comparison exists.
 */
export function SavingsBadge({ brlPrice, brand, category, compact = false }: SavingsBadgeProps) {
  const comparison = getMLComparison(brlPrice, brand, category);
  if (!comparison) return null;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
        <TrendingDown className="h-3 w-3" />
        -{comparison.savingsPercent}% vs BR
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs">
      <TrendingDown className="h-4 w-4 text-emerald-600 shrink-0" />
      <div>
        <span className="text-emerald-800 font-semibold">
          Economize {formatBRL(comparison.savings)} ({comparison.savingsPercent}%)
        </span>
        <span className="text-emerald-600 ml-1">
          vs {formatBRL(comparison.mlPrice)} no Brasil
        </span>
      </div>
    </div>
  );
}
