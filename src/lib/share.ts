import type { CatalogProduct } from "@/types";

export function shareProductWhatsApp(product: CatalogProduct, priceBRL: number) {
  const priceFormatted = priceBRL.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const url = `${window.location.origin}/catalog`;
  const text = `Olha esse produto no MalaBridge! ${product.name} por ${priceFormatted} 🛍️ ${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}
