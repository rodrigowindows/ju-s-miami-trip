import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const Contact = () => {
  const { data: settings } = useSettings();
  const whatsapp = settings?.whatsapp_number ?? "5561999999999";
  const storeName = settings?.store_name ?? "MalaBridge";

  return (
    <section id="contato" className="py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <span className="font-body text-sm font-semibold tracking-widest uppercase text-miami-orange mb-2 block">
            Fale conosco
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Entre em contato
          </h2>
          <p className="font-body text-muted-foreground">
            Tire suas dúvidas ou faça seu pedido
          </p>
        </div>

        {/* WhatsApp CTA */}
        <div className="text-center mb-12">
          <Button
            size="lg"
            className="font-body text-base px-8 py-6 rounded-full bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white shadow-lg gap-2"
            asChild
          >
            <a
              href={`https://wa.me/${whatsapp}?text=Olá! Vim do site ${storeName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={20} />
              Falar pelo WhatsApp
            </a>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted-foreground font-body">
              ou envie uma mensagem
            </span>
          </div>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name");
            const email = formData.get("email");
            const message = formData.get("message");
            window.open(
              `https://wa.me/${whatsapp}?text=Nome: ${name}%0AEmail: ${email}%0AMensagem: ${message}`,
              "_blank"
            );
          }}
        >
          <Input
            name="name"
            placeholder="Seu nome"
            required
            className="font-body rounded-lg"
          />
          <Input
            name="email"
            type="email"
            placeholder="Seu e-mail"
            required
            className="font-body rounded-lg"
          />
          <Textarea
            name="message"
            placeholder="Sua mensagem..."
            required
            className="font-body rounded-lg"
            rows={4}
          />
          <Button type="submit" className="w-full font-body rounded-full" size="lg">
            Enviar mensagem
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
