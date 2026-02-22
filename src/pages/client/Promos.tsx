import { Tag } from "lucide-react";

export default function Promos() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 pt-3 pb-3">
        <h1 className="font-display text-xl font-bold text-foreground">Promoções</h1>
        <p className="text-xs text-muted-foreground">
          Ofertas especiais para você
        </p>
      </header>

      <main className="px-4 pt-4 pb-24">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
            <Tag size={28} className="text-violet-600" />
          </div>
          <h2 className="font-display text-lg font-bold text-foreground mb-2">
            Em breve!
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Estamos preparando promoções especiais para você. Fique ligado!
          </p>
        </div>
      </main>
    </div>
  );
}
