import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plane, ShoppingBag, Sparkles, Gift, Tag, Truck } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  gradient: string;
  icon: React.ReactNode;
  accent: string;
}

const SLIDES: Slide[] = [
  {
    title: "Compre dos EUA, receba no Brasil",
    subtitle: "Personal shopper em Miami com entrega segura e rastreamento em tempo real",
    cta: "Ver Catálogo",
    ctaLink: "#catalogo",
    gradient: "linear-gradient(135deg, #232F3E 0%, #37475A 50%, #131921 100%)",
    icon: <Plane size={48} className="text-amber-400" />,
    accent: "#FFD814",
  },
  {
    title: "Pré-Venda Exclusiva",
    subtitle: "Garanta seu produto dos EUA antes de todo mundo. Reserve agora e receba primeiro!",
    cta: "Ver Produtos",
    ctaLink: "#catalogo",
    gradient: "linear-gradient(135deg, #FF69B4 0%, #8B5CF6 100%)",
    icon: <Tag size={48} className="text-white" />,
    accent: "#FFFFFF",
  },
  {
    title: "Skincare & Beauty Originais",
    subtitle: "As melhores marcas americanas de cuidado com a pele direto de Miami",
    cta: "Ver Produtos",
    ctaLink: "#catalogo",
    gradient: "linear-gradient(135deg, #e8d5b7 0%, #c9a96e 50%, #8B6914 100%)",
    icon: <Sparkles size={48} className="text-white" />,
    accent: "#FFFFFF",
  },
  {
    title: "Perfumes Importados",
    subtitle: "Fragrâncias exclusivas com preço de outlet americano",
    cta: "Explorar",
    ctaLink: "#catalogo",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    icon: <ShoppingBag size={48} className="text-[#D4AF37]" />,
    accent: "#D4AF37",
  },
  {
    title: "Frete Grátis acima de R$500",
    subtitle: "Parcele em até 3x sem juros no cartão. Entrega em até 15 dias úteis",
    cta: "Aproveitar",
    ctaLink: "#catalogo",
    gradient: "linear-gradient(135deg, #0f9b0f 0%, #006400 100%)",
    icon: <Truck size={48} className="text-white" />,
    accent: "#FFFFFF",
  },
];

const INTERVAL = 5000;

export default function HeroBannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide */}
      <div
        className="relative flex items-center justify-center px-4 py-3 sm:py-10 md:py-16 transition-all duration-700"
        style={{ background: slide.gradient }}
      >
        {/* Decorative circles */}
        <div className="absolute top-4 right-[10%] w-32 h-32 rounded-full bg-white/5 pointer-events-none hidden sm:block" />
        <div className="absolute bottom-2 left-[5%] w-20 h-20 rounded-full bg-white/5 pointer-events-none hidden sm:block" />

        <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-10 relative z-10">
          {/* Icon */}
          <div className="shrink-0 hidden sm:flex w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm items-center justify-center">
            {slide.icon}
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2
              className="text-base sm:text-2xl md:text-3xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Gabarito', serif" }}
            >
              {slide.title}
            </h2>
            <p className="text-xs sm:text-base text-white/80 mt-0.5 sm:mt-2 max-w-lg">
              {slide.subtitle}
            </p>
            <div className="mt-2 sm:mt-4 hidden sm:block">
              <Link
                to={slide.ctaLink}
                className="inline-block font-bold text-sm rounded-full px-8 py-3 transition-colors"
                style={{
                  backgroundColor: slide.accent,
                  color: slide.accent === "#FFFFFF" ? "#111" : "#111",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {slide.cta} &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Próximo slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
