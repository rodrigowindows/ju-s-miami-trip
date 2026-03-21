import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-1">
          <Link to="/" className="hover:underline hover:text-gray-700">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Política de privacidade</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 prose prose-sm max-w-none">
        <h1>Política de Privacidade</h1>
        <p><em>Última atualização: Março de 2026</em></p>

        <h2>1. Dados que coletamos</h2>
        <p>Coletamos os seguintes dados pessoais:</p>
        <ul>
          <li>Nome completo e e-mail (para cadastro)</li>
          <li>Número de telefone/WhatsApp (para comunicação sobre pedidos)</li>
          <li>Endereço de entrega</li>
          <li>Dados de navegação (cookies e analytics)</li>
        </ul>

        <h2>2. Como usamos seus dados</h2>
        <ul>
          <li>Processar e acompanhar seus pedidos</li>
          <li>Enviar atualizações sobre compras e entregas</li>
          <li>Melhorar a experiência de navegação no site</li>
          <li>Enviar promoções (com seu consentimento)</li>
        </ul>

        <h2>3. Compartilhamento</h2>
        <p>Não vendemos ou compartilhamos seus dados pessoais com terceiros, exceto quando necessário para a prestação do serviço (ex: transportadora para entrega).</p>

        <h2>4. Seus direitos (LGPD)</h2>
        <p>De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
        <ul>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos ou desatualizados</li>
          <li>Solicitar a exclusão dos seus dados</li>
          <li>Revogar o consentimento para comunicações</li>
        </ul>

        <h2>5. Cookies</h2>
        <p>Utilizamos cookies para melhorar sua experiência de navegação e para fins analíticos. Você pode desativar cookies nas configurações do seu navegador.</p>

        <h2>6. Contato</h2>
        <p>Para dúvidas sobre privacidade, entre em contato pelo e-mail: <strong>contato@ajuvaiparamiami.com</strong></p>
      </div>

      <Footer />
    </div>
  );
}
