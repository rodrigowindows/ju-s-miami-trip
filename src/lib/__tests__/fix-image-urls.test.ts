import { describe, it, expect } from "vitest";
import { fixImageUrl } from "@/lib/fix-image-urls";

describe("fixImageUrl", () => {
  it("returns empty string for null/undefined", () => {
    expect(fixImageUrl(null)).toBe("");
    expect(fixImageUrl(undefined)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(fixImageUrl("")).toBe("");
  });

  it("returns local paths unchanged", () => {
    expect(fixImageUrl("/images/products/beauty/test.jpg")).toBe("/images/products/beauty/test.jpg");
  });

  it("returns empty string for blocked domains", () => {
    const result = fixImageUrl("https://fimgs.net/some-image.jpg");
    expect(result).toBe("");
  });

  it("handles Amazon URLs", () => {
    const url = "https://m.media-amazon.com/images/I/valid-id._SL1500_.jpg";
    const result = fixImageUrl(url);
    // Should convert _SL to _AC_SL
    expect(result).toContain("_AC_SL");
  });
});
