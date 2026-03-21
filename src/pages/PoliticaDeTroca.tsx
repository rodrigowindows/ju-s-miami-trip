import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";

export default function PoliticaDeTroca() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-1">
          <Link to="/" className="hover:underline hover:text-gray-700">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Política de troca</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 prose prose-sm max-w-none">
        <h1>Política de Troca e Devolução</h1>
        <p><em>Última atualização: Março de 2026</em></p>

        <h2>1. Trocas</h2>
        <p>Aceitamos trocas em caso de:</p>
        <ul>
          <li>Produto com defeito de fabricação</li>
          <li>Produto diferente do solicitado</li>
          <li>Tamanho incorreto (quando o erro for nosso)</li>
        </ul>
        <p>O prazo para solicitar troca é de <strong>7 dias</strong> após o recebimento do produto.</p>

        <h2>2. Devoluções</h2>
        <p>Para produtos sem defeito, não oferecemos devolução, pois os itens são comprados sob encomenda nos Estados Unidos. Avalie bem antes de confirmar seu pedido.</p>

        <h2>3. Produtos com defeito</h2>
        <p>Caso receba um produto com defeito, entre em contato imediatamente pelo WhatsApp com fotos do problema. Faremos a substituição na próxima viagem ou o reembolso integral.</p>

        <h2>4. Como solicitar</h2>
        <p>Entre em contato pelo WhatsApp informando:</p>
        <ul>
          <li>Número do pedido</li>
          <li>Descrição do problema</li>
          <li>Fotos do produto</li>
        </ul>

        <h2>5. Reembolso</h2>
        <p>Reembolsos são realizados via PIX em até 5 dias úteis após a aprovação da solicitação.</p>
      </div>

      <Footer />
    </div>
  );
}
