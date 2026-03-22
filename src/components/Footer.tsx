import { Instagram, MessageCircle, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Newsletter from "./Newsletter";
import { useSettings } from "@/hooks/useSettings";

const Footer = () => {
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.whatsapp_number || "5579988070350";

  return (
    <>
      <Newsletter />
      <footer className="bg-card w-full border-t border-border pt-14 px-5 pb-0">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Logo + Description + Social Icons */}
            <div>
              <span className="font-display text-lg font-bold text-foreground">
                AjuVaiParaMiami ✈️
              </span>
              <p className="mt-2 text-muted-foreground text-[13px]">
                Personal Shopper dos EUA para o Brasil
              </p>
              <div className="flex gap-3 mt-4">
                <a
                  href="https://instagram.com/ajuvaiparamiami"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={24} />
                </a>
                <a
                  href="https://tiktok.com/@ajuvaiparamiami"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Institucional */}
            <div>
              <h4 className="font-display font-bold text-foreground mb-4 text-[15px]">
                Institucional
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Sobre nós", to: "/sobre" },
                  { label: "Como funciona", to: "/como-funciona" },
                  { label: "Política de troca", to: "/politica-de-troca" },
                  { label: "Política de privacidade", to: "/politica-de-privacidade" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-muted-foreground hover:text-primary transition-colors text-[13px]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Atendimento */}
            <div>
              <h4 className="font-display font-bold text-foreground mb-4 text-[15px]">
                Atendimento
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-[13px]">WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-[13px]">contato@ajuvaiparamiami.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground text-[13px]">Seg a Sex, 9h - 18h</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Pagamento */}
            <div>
              <h4 className="font-display font-bold text-foreground mb-4 text-[15px]">
                Pagamento
              </h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "PIX", className: "text-muted-foreground" },
                  { label: "VISA", className: "text-primary" },
                  { label: "MC", className: "text-destructive" },
                  { label: "ELO", className: "text-accent-foreground" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="flex items-center justify-center bg-muted/20 rounded-md w-12 h-8"
                  >
                    <span className={`font-bold text-[10px] ${card.className}`}>
                      {card.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom divider + copyright */}
          <div className="text-center mt-10 border-t border-border py-5">
            <p className="text-muted-foreground text-[12px]">
              AjuVaiParaMiami © {new Date().getFullYear()}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;