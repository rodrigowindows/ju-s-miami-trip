import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-[90vh] flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-miami-pink/10 via-background to-miami-blue/10" />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-miami-orange/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-miami-pink/10 blur-3xl" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <span className="inline-block font-body text-sm font-semibold tracking-widest uppercase text-miami-orange mb-4">
          🌴 Sua ponte de compras para Miami
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6 text-foreground">
          Mala
          <span className="bg-gradient-to-r from-miami-pink via-miami-orange to-miami-blue bg-clip-text text-transparent">
            Bridge
          </span>
        </h1>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Compre nos EUA e receba no Brasil. Personal shopper em Miami
          com preços imbatíveis e entrega segura.
        </p>
        <Button
          size="lg"
          className="font-body text-base px-8 py-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
          asChild
        >
          <a href="#produtos">Ver Produtos</a>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
