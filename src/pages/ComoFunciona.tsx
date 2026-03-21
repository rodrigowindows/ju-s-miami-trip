import { Link } from "react-router-dom";
import { ChevronRight, Search, ShoppingCart, Plane, Package } from "lucide-react";
import Footer from "@/components/Footer";

const steps = [
  { icon: Search, title: "1. Escolha o produto", desc: "Navegue pelo nosso catálogo ou nos envie o link de qualquer produto que deseja dos EUA. Também aceitamos pedidos personalizados pelo WhatsApp." },
  { icon: ShoppingCart, title: "2. Faça o pedido", desc: "Confirme seu pedido pelo WhatsApp, receba o valor total com a conversão do dia e faça o pagamento via PIX. O sinal é de 50% do valor." },
  { icon: Plane, title: "3. Compramos em Miami", desc: "Na próxima viagem, compramos seu produto pessoalmente nas lojas oficiais. Você recebe fotos e vídeos da compra em tempo real!" },
  { icon: Package, title: "4. Entregamos pra você", desc: "Após o retorno ao Brasil, entregamos seu produto em mãos em Aracaju ou enviamos para sua cidade. Tudo com rastreio e segurança." },
];

export default function ComoFunciona() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-1">
          <Link to="/" className="hover:underline hover:text-gray-700">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Como funciona</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Como funciona</h1>
          <p className="text-lg text-gray-600 mt-3">Comprar dos EUA nunca foi tão fácil. Veja o passo a passo:</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-5 bg-gray-50 rounded-xl p-6">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <step.icon size={24} className="text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-rose-50 rounded-xl p-8">
          <p className="text-lg font-bold text-gray-900">Ficou com dúvida?</p>
          <p className="text-gray-600 text-sm mt-1">Fale com a gente pelo WhatsApp!</p>
          <a
            href="https://wa.me/5561999999999?text=Olá! Quero saber mais sobre como funciona o serviço."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full text-white font-semibold text-sm"
            style={{ backgroundColor: "#25D366" }}
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
