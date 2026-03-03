import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import type { CatalogProduct } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const CART_STORAGE_KEY = "ajuvaiparamiami_cart";

export interface CartItem {
  product: CatalogProduct;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: CatalogProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: CatalogProduct) => {
    // Track add_to_cart event
    const vid = localStorage.getItem("ajuvaiparamiami_vid") || "unknown";
    (supabase as any).from("site_events").insert({
      event_type: "add_to_cart",
      visitor_id: vid,
      product_id: product.id,
      product_name: product.name,
      product_brand: product.brand,
      product_category: product.category,
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
      screen_width: window.innerWidth,
      metadata: {},
    }).then(() => {});

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, totalItems, isOpen, openCart, closeCart }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, isOpen, openCart, closeCart],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
