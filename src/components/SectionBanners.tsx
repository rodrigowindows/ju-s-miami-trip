import { Link } from "react-router-dom";
import { Plane, ShoppingBag, Star, Gift } from "lucide-react";

export function PreSaleBanner() {
  return (
    <div className="px-3 my-10">
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FF69B4, #8B5CF6)",
        }}
      >
        <div className="flex flex-col md:flex-row items-center h-auto md:h-[200px]">
          {/* Text side (60%) */}
          <div className="flex-[6] flex flex-col justify-center px-6 py-6 md:py-0 md:px-10 text-center md:text-left">
            <h2 className="font-display text-2xl md:text-[32px] font-bold text-white leading-tight">
              PRÉ-VENDA EXCLUSIVA
            </h2>
            <p className="text-white text-sm md:text-base mt-2 opacity-90">
              Garanta seu produto dos EUA antes de todo mundo
            </p>
            <div className="mt-4">
              <Link
                to="/login"
                className="inline-block bg-white text-black font-bold text-sm rounded-full px-8 py-3 hover:bg-gray-100 transition-colors"
              >
                Ver Produtos →
              </Link>
            </div>
          </div>

          {/* Decorative side (40%) */}
          <div className="flex-[4] hidden md:flex items-center justify-center relative h-full">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Decorative circles and icons */}
              <div className="absolute w-28 h-28 rounded-full bg-white/10 top-4 right-8" />
              <div className="absolute w-16 h-16 rounded-full bg-white/10 bottom-6 right-28" />
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center rotate-6">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center -rotate-6 -mt-6">
                  <Star size={24} className="text-white" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center rotate-12 mt-4">
                  <Gift size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile decorative icons */}
          <div className="flex md:hidden items-center justify-center gap-3 pb-5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Star size={18} className="text-white" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Gift size={18} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FreeShippingBanner() {
  return (
    <div className="px-3 my-10">
      <div className="w-full h-20 rounded-lg bg-black flex items-center justify-center gap-3 px-4">
        <Plane size={22} className="text-[#D4AF37] shrink-0" />
        <p className="text-center">
          <span className="text-[#D4AF37] font-bold text-sm md:text-base">
            FRETE GRÁTIS
          </span>
          <span className="text-white text-xs md:text-sm ml-1.5">
            acima de R$ 500
          </span>
        </p>
      </div>
    </div>
  );
}
