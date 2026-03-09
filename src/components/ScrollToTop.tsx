import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-6 z-[1000] w-10 h-10 rounded-full bg-muted text-muted-foreground shadow-lg flex items-center justify-center hover:bg-accent transition-colors animate-in fade-in duration-200"
      aria-label="Voltar ao topo"
    >
      <ArrowUp size={18} />
    </button>
  );
}
