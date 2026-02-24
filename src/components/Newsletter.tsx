import { useState } from "react";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: "Cadastro realizado!",
      description: "Você receberá nossas ofertas exclusivas em breve.",
    });
    setEmail("");
  };

  return (
    <section
      style={{ backgroundColor: "#F5F5F5", padding: "60px 20px" }}
      className="w-full"
    >
      <div className="max-w-[500px] mx-auto text-center">
        <h2
          className="font-display text-black mb-2"
          style={{ fontSize: "24px" }}
        >
          Receba nossas ofertas exclusivas
        </h2>
        <p className="mb-6" style={{ color: "#666", fontSize: "14px" }}>
          Cadastre-se e ganhe 10% OFF na primeira compra
        </p>
        <form onSubmit={handleSubmit} className="flex justify-center">
          <div className="flex w-full rounded-full overflow-hidden border border-gray-300">
            <div className="relative flex-1">
              <Mail
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none border-none rounded-l-full"
                required
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 bg-black text-white text-sm font-semibold tracking-wider rounded-r-full hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              CADASTRAR
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
