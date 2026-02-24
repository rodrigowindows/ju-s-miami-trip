import { Instagram, MessageCircle, Mail, Clock, CreditCard } from "lucide-react";
import Newsletter from "./Newsletter";

const Footer = () => {
  return (
    <>
      <Newsletter />
      <footer
        className="bg-white w-full"
        style={{ borderTop: "1px solid #eee", padding: "60px 20px 0" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* 4-column grid: 4 cols desktop, 2 tablet, 1 mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Logo + Description + Social Icons */}
            <div>
              <span className="font-display text-lg font-bold text-black">
                AjuVaiParaMiami ✈️
              </span>
              <p className="mt-2" style={{ color: "#999", fontSize: "13px" }}>
                Personal Shopper dos EUA para o Brasil
              </p>
              <div className="flex gap-3 mt-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={24} />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                  aria-label="TikTok"
                >
                  {/* TikTok SVG icon */}
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
              <h4
                className="font-display font-bold text-black mb-4"
                style={{ fontSize: "15px" }}
              >
                Institucional
              </h4>
              <ul className="space-y-2">
                {["Sobre nós", "Como funciona", "Política de troca", "Política de privacidade"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-orange-500 transition-colors"
                        style={{ fontSize: "13px" }}
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Column 3: Atendimento */}
            <div>
              <h4
                className="font-display font-bold text-black mb-4"
                style={{ fontSize: "15px" }}
              >
                Atendimento
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-gray-400" />
                  <span style={{ color: "#666", fontSize: "13px" }}>
                    WhatsApp
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span style={{ color: "#666", fontSize: "13px" }}>
                    contato@ajuvaiparamiami.com
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span style={{ color: "#666", fontSize: "13px" }}>
                    Seg a Sex, 9h - 18h
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 4: Pagamento */}
            <div>
              <h4
                className="font-display font-bold text-black mb-4"
                style={{ fontSize: "15px" }}
              >
                Pagamento
              </h4>
              <div className="flex flex-wrap gap-3">
                {/* Pix */}
                <div
                  className="flex items-center justify-center bg-gray-100 rounded-md"
                  style={{ width: "48px", height: "32px" }}
                >
                  <span
                    className="font-bold text-gray-600"
                    style={{ fontSize: "10px" }}
                  >
                    PIX
                  </span>
                </div>
                {/* Visa */}
                <div
                  className="flex items-center justify-center bg-gray-100 rounded-md"
                  style={{ width: "48px", height: "32px" }}
                >
                  <span
                    className="font-bold text-blue-700"
                    style={{ fontSize: "10px" }}
                  >
                    VISA
                  </span>
                </div>
                {/* Mastercard */}
                <div
                  className="flex items-center justify-center bg-gray-100 rounded-md"
                  style={{ width: "48px", height: "32px" }}
                >
                  <span
                    className="font-bold text-red-600"
                    style={{ fontSize: "10px" }}
                  >
                    MC
                  </span>
                </div>
                {/* Elo */}
                <div
                  className="flex items-center justify-center bg-gray-100 rounded-md"
                  style={{ width: "48px", height: "32px" }}
                >
                  <span
                    className="font-bold text-yellow-600"
                    style={{ fontSize: "10px" }}
                  >
                    ELO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom divider + copyright */}
          <div
            className="text-center mt-10"
            style={{
              borderTop: "1px solid #eee",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            <p style={{ color: "#999", fontSize: "12px" }}>
              AjuVaiParaMiami © {new Date().getFullYear()}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
