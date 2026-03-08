import { fixImageUrl } from "@/lib/fix-image-urls";
import type { CatalogProduct } from "@/types";

/** Normalize a raw catalog product row for display */
export function transformProduct(raw: CatalogProduct): CatalogProduct {
  return {
    ...raw,
    image_url: fixImageUrl(raw.image_url),
    availability_type: (!raw.availability_type || raw.availability_type === "esgotado") ? "pronta_entrega" : raw.availability_type,
    stock_quantity: (!raw.stock_quantity || raw.stock_quantity <= 0) ? 2 : raw.stock_quantity,
  };
}

/** Filter products that have valid images */
export function filterVisibleProducts(products: CatalogProduct[]): CatalogProduct[] {
  return products.map(transformProduct).filter((p) => p.image_url && p.image_url.trim() !== "");
}
