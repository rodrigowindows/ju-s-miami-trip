import { ShoppingCart, ShoppingBag, Plane, Package, Home } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "Escolha seu produto",
    description:
      "Navegue pelo catálogo e selecione o que deseja dos EUA.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Nós compramos nos EUA",
    description:
      "Realizamos a compra em Miami com total segurança.",
  },
  {
    number: "03",
    icon: Plane,
    title: "Enviamos para o Brasil",
    description:
      "Trazemos na próxima viagem com acompanhamento.",
  },
  {
    number: "04",
    icon: Home,
    title: "Receba em casa",
    description:
      "Entregamos diretamente na sua porta.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="bg-white" style={{ padding: "80px 20px" }}>
      <div className="mx-auto" style={{ maxWidth: 1000 }}>
        <h2
          className="text-center mb-12"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#111",
          }}
        >
          Como Funciona
        </h2>

        {/* Desktop: horizontal layout */}
        <div className="hidden md:block">
          <div className="relative flex items-start justify-between">
            {/* Dashed connecting line */}
            <div
              className="absolute"
              style={{
                top: 50,
                left: "12.5%",
                right: "12.5%",
                borderTop: "2px dashed #ddd",
              }}
            />

            {steps.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
                style={{ width: "25%" }}
              >
                {/* Watermark number */}
                <span
                  className="absolute select-none pointer-events-none"
                  style={{
                    top: -10,
                    fontSize: 40,
                    fontWeight: 700,
                    color: "#e0e0e0",
                    lineHeight: 1,
                    zIndex: 0,
                  }}
                >
                  {step.number}
                </span>

                {/* Circle with icon */}
                <div
                  className="relative z-10 flex items-center justify-center rounded-full"
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: "#FFF3E0",
                    marginTop: 20,
                  }}
                >
                  <step.icon size={36} style={{ color: "#E65100" }} />
                </div>

                {/* Title */}
                <h3
                  className="mt-4"
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111",
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="mt-1"
                  style={{
                    fontSize: 13,
                    color: "#666",
                    maxWidth: 180,
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical layout */}
        <div className="md:hidden flex flex-col items-center">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Vertical dashed line (between cards) */}
              {i < steps.length - 1 && (
                <div
                  className="absolute"
                  style={{
                    top: 100,
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: 40,
                    borderLeft: "2px dashed #ddd",
                  }}
                />
              )}

              {/* Watermark number */}
              <span
                className="select-none pointer-events-none"
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: "#e0e0e0",
                  lineHeight: 1,
                }}
              >
                {step.number}
              </span>

              {/* Circle with icon */}
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#FFF3E0",
                  marginTop: -8,
                }}
              >
                <step.icon size={36} style={{ color: "#E65100" }} />
              </div>

              {/* Title */}
              <h3
                className="mt-3"
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111",
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="mt-1"
                style={{
                  fontSize: 13,
                  color: "#666",
                  maxWidth: 220,
                  lineHeight: 1.4,
                  marginBottom: i < steps.length - 1 ? 40 : 0,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
