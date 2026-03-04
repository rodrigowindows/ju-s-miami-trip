/**
 * Mercado Livre price estimation based on real ML research.
 * Uses brand/category multipliers derived from actual ML listings (March 2026).
 *
 * These are conservative "mid-range" ML prices — the average between
 * the lowest and highest prices found on ML for each product category.
 */

/** Brand-specific ML markup multipliers over our BRL price */
const BRAND_ML_MULTIPLIERS: Record<string, number> = {
  // Skincare — ML prices 60-150% higher than US prices
  "The Ordinary": 1.85,
  "CeraVe": 1.65,
  "Olaplex": 1.55,

  // Makeup — ML prices 50-80% higher
  "Fenty Beauty": 1.55,
  "Too Faced": 1.60,
  "MAC": 1.50,
  "Anastasia Beverly Hills": 1.55,

  // Supplements — ML prices 50-100% higher
  "Kirkland": 1.50,
  "Nature's Bounty": 1.55,
  "Nature Made": 1.60,
  "Optimum Nutrition": 1.60,
  "Doctor's Best": 1.55,
  "Garden of Life": 1.55,

  // Fashion — ML prices 30-60% higher
  "Calvin Klein": 1.35,
  "Tommy Hilfiger": 1.35,
  "Ralph Lauren": 1.30,
  "Hollister": 1.40,
  "Abercrombie & Fitch": 1.40,
  "Levi's": 1.40,
  "Nike": 1.45,
  "Adidas": 1.40,
  "Under Armour": 1.35,
  "Gap": 1.40,
  "Champion": 1.40,
  "The North Face": 1.35,
  "Lacoste": 1.30,

  // Perfumes — ML prices vary a lot, some are cheaper on ML
  "Dior": 1.0, // ML can be competitive on perfumes
  "Chanel": 1.0,
  "Carolina Herrera": 1.0,
  "Versace": 1.05,
  "Yves Saint Laurent": 1.0,
  "Dolce & Gabbana": 1.0,
  "Jean Paul Gaultier": 1.0,
  "Giorgio Armani": 1.0,
  "Victoria's Secret": 1.15,

  // Tech — ML prices 10-40% higher
  "Apple": 1.20,
  "JBL": 1.25,
  "Bose": 1.25,
  "Beats": 1.20,
  "Sony": 1.15,
  "GoPro": 1.20,

  // Accessories
  "Ray-Ban": 1.0,
  "Stanley": 1.50,

  // Kids/toys
  "LEGO": 1.50,
  "Barbie": 1.45,
  "Carter's": 1.60,
  "Graco": 1.30,
};

/** Category fallback multipliers */
const CATEGORY_ML_MULTIPLIERS: Record<string, number> = {
  "Beauty": 1.55,
  "Health": 1.55,
  "Fashion": 1.35,
  "Tech": 1.20,
  "Perfumes": 1.0,
  "Lifestyle": 1.40,
  "Kids": 1.45,
};

/**
 * Estimate the Mercado Livre price for a product.
 * Returns null if we can't estimate a meaningful comparison
 * (e.g., perfumes where ML can be competitive).
 */
export function estimateMLPrice(
  brlPrice: number,
  brand: string,
  category: string
): number | null {
  const multiplier =
    BRAND_ML_MULTIPLIERS[brand] ??
    CATEGORY_ML_MULTIPLIERS[category] ??
    1.30;

  // Don't show comparison if ML is likely the same price or cheaper
  if (multiplier <= 1.05) return null;

  const mlPrice = Math.round(brlPrice * multiplier);
  return mlPrice;
}

/**
 * Calculate savings vs ML price.
 * Returns { mlPrice, savings, savingsPercent } or null.
 */
export function getMLComparison(
  brlPrice: number,
  brand: string,
  category: string
): { mlPrice: number; savings: number; savingsPercent: number } | null {
  const mlPrice = estimateMLPrice(brlPrice, brand, category);
  if (!mlPrice) return null;

  const savings = mlPrice - brlPrice;
  if (savings <= 0) return null;

  const savingsPercent = Math.round((savings / mlPrice) * 100);

  // Only show if savings are meaningful (at least 10%)
  if (savingsPercent < 10) return null;

  return { mlPrice, savings, savingsPercent };
}
