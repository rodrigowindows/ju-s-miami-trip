import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const products = [
  {
    name: "Kit Viagem Miami",
    price: "R$ 149,90",
    description: "Essenciais para sua viagem perfeita",
    emoji: "🧳",
  },
  {
    name: "Guia Miami Completo",
    price: "R$ 49,90",
    description: "Roteiros, dicas e lugares secretos",
    emoji: "📖",
  },
  {
    name: "Acessórios Miami Style",
    price: "R$ 89,90",
    description: "Estilo praiano para arrasar",
    emoji: "🕶️",
  },
  {
    name: "Consultoria de Viagem",
    price: "R$ 199,90",
    description: "Planejamento personalizado",
    emoji: "✨",
  },
];

const Products = () => {
  return (
    <section id="produtos" className="py-24 bg-miami-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-body text-sm font-semibold tracking-widest uppercase text-miami-blue mb-2 block">
            Nossos Produtos
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Feitos para você
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {products.map((product) => (
            <Card
              key={product.name}
              className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card"
            >
              <CardHeader>
                <div className="text-5xl mb-3">{product.emoji}</div>
                <CardTitle className="font-display text-xl">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-muted-foreground text-sm">
                  {product.description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="font-display text-2xl font-bold text-primary">
                  {product.price}
                </span>
                <Button
                  size="sm"
                  className="font-body rounded-full gap-2"
                  asChild
                >
                  <a
                    href={`https://wa.me/5511999999999?text=Olá! Tenho interesse no ${product.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ShoppingBag size={16} />
                    Comprar
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
