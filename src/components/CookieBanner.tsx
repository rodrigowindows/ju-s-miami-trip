import { useState, useEffect } from "react";

const COOKIE_KEY = "malabridge_cookies_accepted";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card shadow-lg z-[1000] animate-fade-in p-4 sm:px-6">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto flex-wrap">
        <p className="text-foreground text-[13px] leading-snug">
          Ao navegar por este site você aceita o uso de cookies para melhorar
          sua experiência.
        </p>
        <button
          onClick={accept}
          className="bg-primary text-primary-foreground text-[13px] rounded px-5 py-2 whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
