import { useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { useWhatsAppCheckout } from "@/hooks/useWhatsAppCheckout";
import { toast } from "@/hooks/use-toast";
import type { CatalogProduct } from "@/types";

/**
 * Centralized hook for all purchase actions across the app.
 * No login required for cart or WhatsApp buy — the store is public.
 */
export function useBuyAction() {
  const { addItem, openCart } = useCart();
  const { buyNowViaWhatsApp } = useWhatsAppCheckout();

  /** Add product to cart and open drawer. No auth required. */
  const handleAddToCart = useCallback(
    (product: CatalogProduct, opts?: { quantity?: number; showCart?: boolean }) => {
      const qty = opts?.quantity ?? 1;
      addItem(product, qty);
      if (opts?.showCart !== false) {
        openCart();
      }
      return true;
    },
    [addItem, openCart],
  );

  /** Buy now via WhatsApp. No auth required. */
  const handleBuyNow = useCallback(
    (product: CatalogProduct, opts?: { quantity?: number; sizeInfo?: string }) => {
      const qty = opts?.quantity ?? 1;
      buyNowViaWhatsApp(product, qty, opts?.sizeInfo);
      return true;
    },
    [buyNowViaWhatsApp],
  );

  return { handleAddToCart, handleBuyNow };
}