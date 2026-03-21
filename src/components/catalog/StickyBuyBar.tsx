import { useState, useEffect } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWhatsAppCheckout } from "@/hooks/useWhatsAppCheckout";
import { useNavigate } from "react-router-dom";
import type { CatalogProduct } from "@/types";

interface StickyBuyBarProps {
  productName: string;
  priceBrl: number;
  isSoldOut: boolean;
  product?: CatalogProduct;
}

export default function StickyBuyBar({ productName, priceBrl, isSoldOut, product }: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { buyNowViaWhatsApp } = useWhatsAppCheckout();
  const nav = useNavigate();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const handleClick = () => {
    if (!user) { nav("/login"); return; }
    if (product) {
      buyNowViaWhatsApp(product, 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 truncate">{productName}</p>
          <p className="text-lg font-bold text-gray-900">
            {priceBrl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </div>
        <button
          onClick={handleClick}
          disabled={isSoldOut}
          className="shrink-0 bg-[#F43F5E] text-white rounded-lg font-semibold text-sm flex items-center gap-2 px-5 py-3 hover:opacity-90 transition-colors disabled:opacity-50"
        >
          <MessageCircle size={16} />
          {isSoldOut ? "Esgotado" : user ? "Comprar" : "Login"}
        </button>
      </div>
    </div>
  );
}
