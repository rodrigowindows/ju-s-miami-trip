import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Camila R.",
    text: "Super prático! Pedi um tênis que não achava no Brasil e chegou rapidinho. Recomendo demais.",
    stars: 5,
  },
  {
    name: "Lucas M.",
    text: "Atendimento nota 10, preço justo e tudo bem embalado. Já fiz 3 pedidos!",
    stars: 5,
  },
  {
    name: "Fernanda S.",
    text: "Comprei eletrônicos e cosméticos. Veio tudo certinho e economizei bastante comparado a lojas daqui.",
    stars: 4,
  },
];

const Testimonials = () => {
  return (
    <section id="depoimentos" className="py-24 bg-miami-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-body text-sm font-semibold tracking-widest uppercase text-miami-blue mb-2 block">
            Clientes satisfeitos
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Depoimentos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/50 bg-card">
              <CardContent className="pt-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < t.stars
                          ? "fill-miami-orange text-miami-orange"
                          : "text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>
                <p className="font-body text-sm text-muted-foreground mb-4">
                  "{t.text}"
                </p>
                <span className="font-display text-sm font-bold">
                  {t.name}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
