import type { CatalogProduct } from "@/types";
import { slugify } from "@/lib/slugify";


export function shareProductWhatsApp(product: CatalogProduct, priceBRL: number) {
  const priceFormatted = priceBRL.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const productUrl = `${window.location.origin}/produto/${slugify(product.name)}`;
  const text = `Olha esse produto no AjuVaiParaMiami! ${product.name} por ${priceFormatted} 🛍️ ${productUrl}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}
