import { describe, it, expect } from "vitest";
import { fakeRating, isBestSeller, fakePreviousPrice, CATEGORY_LIST, CATEGORIES, SORT_OPTIONS } from "@/components/catalog/catalog-utils";

describe("fakeRating", () => {
  it("returns rating between 3.5 and 5", () => {
    const { rating } = fakeRating("Test Product");
    expect(rating).toBeGreaterThanOrEqual(3.5);
    expect(rating).toBeLessThanOrEqual(5);
  });

  it("returns reviews between 50 and 999", () => {
    const { reviews } = fakeRating("Test Product");
    expect(reviews).toBeGreaterThanOrEqual(50);
    expect(reviews).toBeLessThanOrEqual(999);
  });

  it("is deterministic for the same name", () => {
    const a = fakeRating("CeraVe Moisturizing Cream");
    const b = fakeRating("CeraVe Moisturizing Cream");
    expect(a.rating).toBe(b.rating);
    expect(a.reviews).toBe(b.reviews);
  });

  it("produces different results for different names", () => {
    const a = fakeRating("Product A");
    const b = fakeRating("Product B");
    // Not guaranteed to differ, but very likely
    expect(a.rating !== b.rating || a.reviews !== b.reviews).toBe(true);
  });
});

describe("isBestSeller", () => {
  it("returns a boolean", () => {
    expect(typeof isBestSeller("Test")).toBe("boolean");
  });

  it("is deterministic", () => {
    expect(isBestSeller("Product X")).toBe(isBestSeller("Product X"));
  });
});

describe("fakePreviousPrice", () => {
  it("returns a price higher than input", () => {
    const result = fakePreviousPrice(100, "Test");
    expect(result).toBeGreaterThan(100);
  });

  it("markup is between 10% and 40%", () => {
    const brl = 100;
    const result = fakePreviousPrice(brl, "Test");
    expect(result).toBeGreaterThanOrEqual(brl * 1.1);
    expect(result).toBeLessThanOrEqual(brl * 1.4);
  });
});

describe("CATEGORY_LIST", () => {
  it("has Todos as first category", () => {
    expect(CATEGORY_LIST[0].label).toBe("Todos");
  });

  it("includes main categories", () => {
    const labels = CATEGORY_LIST.map((c) => c.label);
    expect(labels).toContain("Tech");
    expect(labels).toContain("Beauty");
    expect(labels).toContain("Fashion");
    expect(labels).toContain("Kids");
    expect(labels).toContain("Health");
  });

  it("each category has icon and displayLabel", () => {
    CATEGORY_LIST.forEach((cat) => {
      expect(cat.icon).toBeTruthy();
      expect(cat.displayLabel).toBeTruthy();
    });
  });
});

describe("CATEGORIES", () => {
  it("is a readonly array of labels", () => {
    expect(CATEGORIES).toContain("Todos");
    expect(CATEGORIES.length).toBe(CATEGORY_LIST.length);
  });
});

describe("SORT_OPTIONS", () => {
  it("has 4 sort options", () => {
    expect(SORT_OPTIONS).toHaveLength(4);
  });

  it("includes relevance, price_asc, price_desc, name", () => {
    const values = SORT_OPTIONS.map((o) => o.value);
    expect(values).toContain("relevance");
    expect(values).toContain("price_asc");
    expect(values).toContain("price_desc");
    expect(values).toContain("name");
  });
});
