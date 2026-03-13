import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock slugify
vi.mock("@/lib/slugify", () => ({
  slugify: (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
}));

import { shareProductWhatsApp } from "@/lib/share";
import type { CatalogProduct } from "@/types";

const makeProduct = (overrides: Partial<CatalogProduct> = {}): CatalogProduct => ({
  id: "p1",
  name: "CeraVe Moisturizing Cream",
  brand: "CeraVe",
  category: "Beauty",
  price_usd: 15,
  image_url: "/img.jpg",
  image_url_2: "",
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

describe("shareProductWhatsApp", () => {
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openSpy = vi.fn();
    vi.stubGlobal("open", openSpy);
  });

  it("opens WhatsApp with correct URL structure", () => {
    shareProductWhatsApp(makeProduct(), 89.9);
    expect(openSpy).toHaveBeenCalledOnce();
    const url = openSpy.mock.calls[0][0] as string;
    expect(url).toContain("https://wa.me/?text=");
    expect(url).toContain("cerave-moisturizing-cream");
  });

  it("includes product name in shared text", () => {
    shareProductWhatsApp(makeProduct({ name: "Fenty Gloss Bomb" }), 120);
    const url = openSpy.mock.calls[0][0] as string;
    const decoded = decodeURIComponent(url.replace("https://wa.me/?text=", ""));
    expect(decoded).toContain("Fenty Gloss Bomb");
  });

  it("includes formatted BRL price", () => {
    shareProductWhatsApp(makeProduct(), 150.5);
    const url = openSpy.mock.calls[0][0] as string;
    const decoded = decodeURIComponent(url.replace("https://wa.me/?text=", ""));
    expect(decoded).toContain("R$");
    expect(decoded).toContain("150");
  });

  it("opens in new tab", () => {
    shareProductWhatsApp(makeProduct(), 100);
    expect(openSpy).toHaveBeenCalledWith(expect.any(String), "_blank");
  });
});
