import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plane, ShieldCheck, CreditCard, Truck } from "lucide-react";

interface BannerSlide {
  title: string;
  subtitle: string;
  bgGradient: string;
  accent: string;
}

const SLIDES: BannerSlide[] = [
  {
    title: "Compre dos EUA com preços reais",
    subtitle: "Produtos originais de Miami direto para sua casa no Brasil",
    bgGradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    accent: "text-amber-400",
  },
  {
    title: "Frete via viagem — mais barato e seguro",
    subtitle: "Trazemos seus produtos na mala, sem taxas absurdas de importação",
    bgGradient: "from-[#0f3460] via-[#533483] to-[#e94560]",
    accent: "text-pink-300",
  },
  {
    title: "Skincare, Tech & Fashion importados",
    subtitle: "As melhores marcas americanas com até 60% de economia",
    bgGradient: "from-[#2d132c] via-[#801336] to-[#c72c41]",
    accent: "text-rose-300",
  },
];

const BENEFITS = [
  { icon: ShieldCheck, text: "Compra garantida" },
  { icon: CreditCard, text: "Parcele em 3x" },
  { icon: Plane, text: "Viagem Miami" },
  { icon: Truck, text: "Entrega no Brasil" },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="relative overflow-hidden">
      {/* Main banner */}
      <div
        className={`bg-gradient-to-r ${slide.bgGradient} text-white transition-all duration-700`}
      >
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 relative">
          <div className="max-w-xl">
            <h1
              className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-colors hidden sm:block"
            aria-label="Slide anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-1.5 transition-colors hidden sm:block"
            aria-label="Próximo slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Benefits strip */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-around">
          {BENEFITS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon size={14} className="text-[#C45500] shrink-0" />
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium whitespace-nowrap">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
