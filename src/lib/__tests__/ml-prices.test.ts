import { describe, it, expect } from "vitest";
import { estimateMLPrice, getMLComparison } from "@/lib/ml-prices";

describe("estimateMLPrice", () => {
  it("returns multiplied price for known brand", () => {
    // CeraVe has 1.65 multiplier
    const result = estimateMLPrice(100, "CeraVe", "Beauty");
    expect(result).toBe(165);
  });

  it("falls back to category multiplier for unknown brand", () => {
    // Beauty category has 1.55 multiplier
    const result = estimateMLPrice(100, "Unknown Brand", "Beauty");
    expect(result).toBe(155);
  });

  it("falls back to 1.30 for unknown brand and category", () => {
    const result = estimateMLPrice(100, "Unknown", "Unknown");
    expect(result).toBe(130);
  });

  it("returns null when multiplier <= 1.05 (e.g., perfumes)", () => {
    // Dior has 1.0 multiplier
    expect(estimateMLPrice(100, "Dior", "Perfumes")).toBeNull();
  });

  it("returns null for Chanel", () => {
    expect(estimateMLPrice(100, "Chanel", "Perfumes")).toBeNull();
  });
});

describe("getMLComparison", () => {
  it("returns savings info for brands with meaningful savings", () => {
    const result = getMLComparison(100, "CeraVe", "Beauty");
    expect(result).not.toBeNull();
    expect(result!.mlPrice).toBe(165);
    expect(result!.savings).toBe(65);
    expect(result!.savingsPercent).toBe(39); // 65/165 ≈ 39%
  });

  it("returns null for perfume brands (no meaningful savings)", () => {
    expect(getMLComparison(100, "Dior", "Perfumes")).toBeNull();
  });

  it("returns null when savings percent < 10%", () => {
    // Versace has 1.05 multiplier -> null from estimateMLPrice
    expect(getMLComparison(100, "Versace", "Perfumes")).toBeNull();
  });

  it("calculates correct savingsPercent", () => {
    const result = getMLComparison(100, "The Ordinary", "Beauty");
    expect(result).not.toBeNull();
    // The Ordinary: 1.85 multiplier -> mlPrice = 185, savings = 85, percent = round(85/185*100) = 46
    expect(result!.savingsPercent).toBe(46);
  });
});
