import { describe, it, expect } from "vitest";
import { transformProduct, filterVisibleProducts } from "@/lib/transforms";
import type { CatalogProduct } from "@/types";

const makeProduct = (overrides: Partial<CatalogProduct> = {}): CatalogProduct => ({
  id: "test-id",
  name: "Test Product",
  brand: "TestBrand",
  category: "Beauty",
  price_usd: 10,
  image_url: "/images/test.jpg",
  active: true,
  availability_type: "pronta_entrega",
  stock_quantity: 5,
  rating: 4.5,
  review_count: 10,
  sales_count: 20,
  trending: false,
  description: null,
  estimated_days: null,
  created_at: new Date().toISOString(),
  ...overrides,
});

describe("transformProduct", () => {
  it("preserves valid product fields", () => {
    const product = makeProduct();
    const result = transformProduct(product);
    expect(result.name).toBe("Test Product");
    expect(result.brand).toBe("TestBrand");
  });

  it("fixes esgotado availability to pronta_entrega", () => {
    const product = makeProduct({ availability_type: "esgotado" });
    const result = transformProduct(product);
    expect(result.availability_type).toBe("pronta_entrega");
  });

  it("fixes empty availability to pronta_entrega", () => {
    const product = makeProduct({ availability_type: "" as string });
    const result = transformProduct(product);
    expect(result.availability_type).toBe("pronta_entrega");
  });

  it("fixes 0 stock to 2", () => {
    const product = makeProduct({ stock_quantity: 0 });
    const result = transformProduct(product);
    expect(result.stock_quantity).toBe(2);
  });

  it("fixes negative stock to 2", () => {
    const product = makeProduct({ stock_quantity: -1 });
    const result = transformProduct(product);
    expect(result.stock_quantity).toBe(2);
  });

  it("preserves valid stock quantity", () => {
    const product = makeProduct({ stock_quantity: 10 });
    const result = transformProduct(product);
    expect(result.stock_quantity).toBe(10);
  });
});

describe("filterVisibleProducts", () => {
  it("transforms all products in array", () => {
    const products = [
      makeProduct({ stock_quantity: 0 }),
      makeProduct({ availability_type: "esgotado" }),
    ];
    const result = filterVisibleProducts(products);
    expect(result).toHaveLength(2);
    expect(result[0].stock_quantity).toBe(2);
    expect(result[1].availability_type).toBe("pronta_entrega");
  });

  it("returns empty array for empty input", () => {
    expect(filterVisibleProducts([])).toEqual([]);
  });
});
