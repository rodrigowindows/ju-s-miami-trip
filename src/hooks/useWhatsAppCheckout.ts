import { useCallback } from "react";
import { useSettings } from "@/hooks/useSettings";
import { useCart } from "@/contexts/CartContext";
import { calculatePriceBRL } from "@/lib/calculations";
import { slugify } from "@/lib/slugify";
import type { CatalogProduct } from "@/types";

/**
 * Builds WhatsApp checkout messages and opens WhatsApp.
 */
export function useWhatsAppCheckout() {
  const { data: settings } = useSettings();
  const { items } = useCart();

  const phone = settings?.whatsapp_number ?? "5561999999999";
  const exchangeRate = Number(settings?.exchange_rate ?? "5.80");
  const spread = Number(settings?.spread_percent ?? "45");

  const calcBRL = useCallback(
    (usd: number) => calculatePriceBRL(usd, exchangeRate, spread),
    [exchangeRate, spread],
  );

  /** Open WhatsApp for a single product purchase */
  const buyNowViaWhatsApp = useCallback(
    (product: CatalogProduct, quantity: number, extraInfo?: string) => {
      const brl = calcBRL(product.price_usd);
      const total = brl * quantity;
      const url = `${window.location.origin}/produto/${slugify(product.name)}`;
      let text = `Olá! Quero comprar:\n\n🛍️ *${product.name}*\n📦 Qtd: ${quantity}\n💰 Preço: R$ ${total.toFixed(2).replace(".", ",")}\n🔗 ${url}`;
      if (extraInfo) text += `\n📏 ${extraInfo}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
    },
    [calcBRL, phone],
  );

  /** Open WhatsApp with full cart */
  const checkoutCartViaWhatsApp = useCallback(() => {
    if (items.length === 0) return;
    let text = "Olá! Quero finalizar meu pedido:\n\n";
    let grandTotal = 0;
    items.forEach((item, i) => {
      const brl = calcBRL(item.product.price_usd);
      const subtotal = brl * item.quantity;
      grandTotal += subtotal;
      text += `${i + 1}. *${item.product.name}* — Qtd: ${item.quantity} — R$ ${subtotal.toFixed(2).replace(".", ",")}\n`;
    });
    text += `\n💰 *Total: R$ ${grandTotal.toFixed(2).replace(".", ",")}*`;
    text += "\n\nAguardo instruções para pagamento! 🙏";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  }, [items, calcBRL, phone]);

  return { buyNowViaWhatsApp, checkoutCartViaWhatsApp, calcBRL, phone };
}
