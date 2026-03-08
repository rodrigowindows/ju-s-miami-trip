import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MESSAGES = [
  "Compras dos EUA direto para você · Produtos 100% originais e lacrados",
  "Pagamento à vista via PIX · Produtos 100% originais",
  "Use o código MIAMI10 e ganhe 10% OFF na primeira compra",
  "Entrega em até 15 dias úteis · Acompanhamento via WhatsApp",
];

const AnnouncementBar = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-secondary overflow-hidden h-[35px] flex items-center relative">
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + MESSAGES.length) % MESSAGES.length)}
        className="absolute left-2 z-10 text-secondary-foreground/60 hover:text-secondary-foreground transition-colors hidden sm:block"
        aria-label="Mensagem anterior"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex-1 text-center">
        <span
          key={current}
          className="inline-block text-secondary-foreground font-body text-[11px] md:text-[13px] font-medium animate-fade-in px-8"
        >
          {MESSAGES[current]}
        </span>
      </div>

      <button
        onClick={() => setCurrent((prev) => (prev + 1) % MESSAGES.length)}
        className="absolute right-2 z-10 text-secondary-foreground/60 hover:text-secondary-foreground transition-colors hidden sm:block"
        aria-label="Próxima mensagem"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-1">
        {MESSAGES.map((_, i) => (
          <span
            key={i}
            className={`w-1 h-1 rounded-full transition-colors ${
              i === current ? "bg-secondary-foreground" : "bg-secondary-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
