import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plane, Package, CreditCard, CheckCircle2, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Escolha seus produtos",
    description: "Navegue pelo catálogo com produtos dos EUA a preços exclusivos. Perfumes, eletrônicos, suplementos e muito mais!",
    color: "text-primary bg-primary/10",
  },
  {
    icon: CreditCard,
    title: "Faça seu pedido",
    description: "Adicione ao carrinho, aplique cupons de desconto e pague apenas 50% de sinal via PIX. Simples e seguro!",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Plane,
    title: "Compramos nos EUA",
    description: "Nossa equipe compra seus produtos diretamente em Miami e traz na mala, sem taxas de importação!",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Package,
    title: "Receba em casa",
    description: "Entrega em 15-25 dias. Acompanhe cada etapa em tempo real e ganhe 5% de cashback!",
    color: "text-purple-600 bg-purple-50",
  },
];

const STORAGE_KEY = "ajuvai_onboarding_done";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Small delay so the page loads first
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  }

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        {/* Top visual */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 pt-8 pb-6 px-6 text-center">
          <div className={`w-16 h-16 rounded-2xl ${current.color} flex items-center justify-center mx-auto mb-4`}>
            <Icon className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">{current.title}</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{current.description}</p>
        </div>

        {/* Progress dots + actions */}
        <div className="px-6 pb-6 pt-4 space-y-4">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`rounded-full transition-all ${
                  i === step ? "w-6 h-2 bg-primary" : i < step ? "w-2 h-2 bg-primary/40" : "w-2 h-2 bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                Voltar
              </Button>
            )}
            <Button className="flex-1 gap-2" onClick={handleNext}>
              {isLast ? (
                <>
                  <CheckCircle2 size={16} /> Começar a comprar!
                </>
              ) : (
                <>
                  Próximo <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>

          {!isLast && (
            <button onClick={handleClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center">
              Pular tutorial
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
