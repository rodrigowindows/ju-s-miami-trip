import { ShoppingCart, Plane, Package } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Escolha seus produtos",
    description:
      "Envie o link ou foto do que deseja comprar nos EUA. Nós fazemos o orçamento para você.",
  },
  {
    icon: Plane,
    title: "Compramos e trazemos",
    description:
      "Realizamos a compra em Miami e trazemos na próxima viagem com total segurança.",
  },
  {
    icon: Package,
    title: "Receba no Brasil",
    description:
      "Entregamos diretamente para você, com acompanhamento em tempo real do pedido.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-body text-sm font-semibold tracking-widest uppercase text-miami-pink mb-2 block">
            Simples e rápido
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Como funciona
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="font-body text-xs font-bold text-miami-orange uppercase tracking-widest">
                Passo {i + 1}
              </span>
              <h3 className="font-display text-lg font-bold mt-2 mb-2">
                {step.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground">
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
