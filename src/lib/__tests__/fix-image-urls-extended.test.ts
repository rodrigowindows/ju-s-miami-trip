import { describe, it, expect } from "vitest";
import { fixImageUrl, getBrandedPlaceholder } from "@/lib/fix-image-urls";

describe("fixImageUrl - extended", () => {
  it("returns empty for null", () => {
    expect(fixImageUrl(null)).toBe("");
  });

  it("returns empty for undefined", () => {
    expect(fixImageUrl(undefined)).toBe("");
  });

  it("returns empty for whitespace-only", () => {
    expect(fixImageUrl("   ")).toBe("");
  });

  it("blocks fimgs.net domain", () => {
    expect(fixImageUrl("https://fimgs.net/image.jpg")).toBe("");
  });

  it("blocks dior.com domain", () => {
    expect(fixImageUrl("https://www.dior.com/img.jpg")).toBe("");
  });

  it("blocks olaplex.com domain", () => {
    expect(fixImageUrl("https://olaplex.com/products/img.jpg")).toBe("");
  });

  it("blocks known broken Amazon image IDs", () => {
    expect(fixImageUrl("https://m.media-amazon.com/images/I/51kz4YS0YTL._AC_SL500_.jpg")).toBe("");
  });

  it("fixes Amazon _SL to _AC_SL", () => {
    const url = "https://m.media-amazon.com/images/I/81abc._SL500_.jpg";
    expect(fixImageUrl(url)).toContain("_AC_SL500_");
  });

  it("preserves already correct Amazon _AC_SL URLs", () => {
    const url = "https://m.media-amazon.com/images/I/81abc._AC_SL500_.jpg";
    expect(fixImageUrl(url)).toBe(url);
  });

  it("passes through normal URLs unchanged", () => {
    const url = "https://example.com/image.jpg";
    expect(fixImageUrl(url)).toBe(url);
  });

  it("trims whitespace from URLs", () => {
    expect(fixImageUrl("  https://example.com/img.jpg  ")).toBe("https://example.com/img.jpg");
  });
});

describe("getBrandedPlaceholder", () => {
  it("returns fashion fallback for fashion category", () => {
    expect(getBrandedPlaceholder("Nike", "Fashion")).toContain("/fashion/");
  });

  it("returns kids fallback for kids category", () => {
    expect(getBrandedPlaceholder("LEGO", "Kids")).toContain("/kids/");
  });

  it("returns health fallback for supplements", () => {
    expect(getBrandedPlaceholder("Kirkland", "Supplements")).toContain("/health/");
  });

  it("returns brand fallback for The Ordinary", () => {
    expect(getBrandedPlaceholder("The Ordinary", "Unknown")).toContain(".jpg");
  });

  it("returns default fallback for unknown brand and category", () => {
    expect(getBrandedPlaceholder("UnknownBrand", "UnknownCategory")).toBe("/images/product-placeholder.jpg");
  });

  it("handles accented categories", () => {
    expect(getBrandedPlaceholder("Nike", "Perfumés")).toContain(".jpg");
  });
});
