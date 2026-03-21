import { Link } from "react-router-dom";
import { ChevronRight, Heart, Globe, ShoppingBag, Users } from "lucide-react";
import Footer from "@/components/Footer";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-1">
          <Link to="/" className="hover:underline hover:text-gray-700">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Sobre nós</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sobre a AjuVaiParaMiami ✈️</h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            Somos um serviço de personal shopper que conecta Aracaju aos Estados Unidos, trazendo produtos originais de Miami com economia de até 40%.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <Globe size={28} className="text-rose-500" />
            <h3 className="text-lg font-bold text-gray-900">Quem somos</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Nascemos da paixão por produtos americanos e da vontade de torná-los acessíveis. Viajamos regularmente a Miami para comprar pessoalmente os produtos dos nossos clientes, garantindo autenticidade e os melhores preços.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <Heart size={28} className="text-rose-500" />
            <h3 className="text-lg font-bold text-gray-900">Nossa missão</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Proporcionar uma experiência de compra personalizada e transparente, onde cada cliente recebe atenção individual, fotos da compra na loja e acompanhamento completo até a entrega em mãos.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <ShoppingBag size={28} className="text-rose-500" />
            <h3 className="text-lg font-bold text-gray-900">O que compramos</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Perfumes, maquiagens, skincare, calçados, roupas de marca, eletrônicos, suplementos e muito mais. Se está nos EUA, a gente traz pra você!
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <Users size={28} className="text-rose-500" />
            <h3 className="text-lg font-bold text-gray-900">De Aracaju para o mundo</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Baseados em Aracaju, Sergipe, atendemos clientes de todo o Nordeste. Nossa entrega é pessoal e feita com carinho, diretamente na sua porta.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
