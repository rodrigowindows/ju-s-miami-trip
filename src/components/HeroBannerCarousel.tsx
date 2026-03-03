import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    title: "Compre dos EUA, receba no Brasil",
    subtitle: "Personal shopper em Miami com entrega segura e rastreamento em tempo real",
    cta: "Ver Catálogo",
    image: "/banners/banner1.jpg",
  },
  {
    title: "Victoria's Secret & Body Mists",
    subtitle: "As melhores fragrâncias americanas direto de Miami para você",
    cta: "Ver Produtos",
    image: "/banners/banner2.jpg",
  },
  {
    title: "Skincare & Beauty Originais",
    subtitle: "As melhores marcas americanas de cuidado com a pele direto de Miami",
    cta: "Ver Produtos",
    image: "/banners/banner3.jpg",
  },
  {
    title: "Perfumes Importados",
    subtitle: "Fragrâncias exclusivas com preço de outlet americano",
    cta: "Explorar",
    image: "/banners/banner4.jpg",
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
        className="relative flex items-end px-4 py-6 sm:py-10 md:py-16 transition-all duration-700"
        style={{ minHeight: 220 }}
      >
        {/* Background image */}
        <img
          src={slide.image}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          loading={current === 0 ? "eager" : "lazy"}
        />
        {/* Dark overlay for text readability */}
        {/* Subtle gradient for dots visibility */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
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
                ? "w-6 h-2 bg-white shadow-md"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
