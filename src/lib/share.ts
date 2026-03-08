import type { CatalogProduct } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function shareProductWhatsApp(product: CatalogProduct, priceBRL: number) {
  const priceFormatted = priceBRL.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const productUrl = `${window.location.origin}/produto/${slugify(product.name)}`;
  const text = `Olha esse produto no AjuVaiParaMiami! ${product.name} por ${priceFormatted} 🛍️ ${productUrl}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}
