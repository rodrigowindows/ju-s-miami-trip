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
    <div
      className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-[1000] animate-fade-in"
      style={{ padding: "16px 24px" }}
    >
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto flex-wrap">
        <p className="text-black text-[13px] leading-snug">
          Ao navegar por este site você aceita o uso de cookies para melhorar
          sua experiência.
        </p>
        <button
          onClick={accept}
          className="bg-black text-white text-[13px] rounded px-5 py-2 whitespace-nowrap hover:bg-black/90 transition-colors cursor-pointer"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
