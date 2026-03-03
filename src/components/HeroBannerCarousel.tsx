import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  alt: string;
  link: string;
}

const SLIDES: Slide[] = [
  {
    image: "/banners/banner1.png",
    alt: "Banner 1 - Ju's Miami Trip",
    link: "#catalogo",
  },
  {
    image: "/banners/banner2.png",
    alt: "Banner 2 - Ju's Miami Trip",
    link: "#catalogo",
  },
  {
    image: "/banners/banner3.png",
    alt: "Banner 3 - Ju's Miami Trip",
    link: "#catalogo",
  },
  {
    image: "/banners/banner4.png",
    alt: "Banner 4 - Ju's Miami Trip",
    link: "#catalogo",
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
      <a
        href={slide.link}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="block relative w-full"
      >
        <img
          src={slide.image}
          alt={slide.alt}
          className="w-full h-auto object-cover transition-opacity duration-700"
          style={{ minHeight: 120, maxHeight: 500 }}
        />
      </a>

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
