import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import type { CatalogProduct } from "@/types";

/**
 * Centralized hook for all purchase actions across the app.
 * Handles auth check, cart operations, and navigation in one place.
 */
export function useBuyAction() {
  const { user } = useAuth();
  const { addItem, openCart } = useCart();
  const nav = useNavigate();

  const isLoggedIn = !!user;

  /** Add product to cart and open drawer. Redirects to login if not authenticated. */
  const handleAddToCart = useCallback(
    (product: CatalogProduct, opts?: { quantity?: number; showCart?: boolean }) => {
      if (!user) {
        nav("/login");
        return false;
      }
      const qty = opts?.quantity ?? 1;
      addItem(product, qty);
      if (opts?.showCart !== false) {
        openCart();
      }
      return true;
    },
    [user, addItem, openCart, nav],
  );

  /** Add product to cart and go straight to checkout. Redirects to login if not authenticated. */
  const handleBuyNow = useCallback(
    (product: CatalogProduct, opts?: { quantity?: number }) => {
      if (!user) {
        nav("/login");
        return false;
      }
      const qty = opts?.quantity ?? 1;
      addItem(product, qty);
      nav("/client/checkout");
      return true;
    },
    [user, addItem, nav],
  );

  /** Navigate to login page (for explicit login buttons). */
  const goToLogin = useCallback(() => nav("/login"), [nav]);

  return { isLoggedIn, handleAddToCart, handleBuyNow, goToLogin };
}
