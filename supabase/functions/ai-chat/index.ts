import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Você é a assistente virtual da "A Ju vai para Miami", um serviço de personal shopper que traz produtos dos EUA (Miami) para o Brasil.

REGRAS:
- Responda SEMPRE em português brasileiro, de forma simpática e objetiva.
- Use emojis com moderação para ser amigável.
- Quando não souber a resposta exata, sugira contatar pelo WhatsApp.
- Nunca invente preços ou prazos que não estejam no contexto.

INFORMAÇÕES DO NEGÓCIO:
- Serviço: compramos produtos nos EUA e entregamos no Brasil
- Prazo médio: 15-25 dias úteis
- Pagamento: PIX (sinal + saldo na entrega)
- Categorias: Perfumes, Beleza, Saúde, Tecnologia, Moda
- Marcas principais: Victoria's Secret, Bath & Body Works, Kirkland, etc.
- Cashback: 5% em crédito na carteira digital após entrega
- Programa de indicação: R$30 de crédito por amigo indicado

${context ? `CONTEXTO ADICIONAL:\n${context}` : ""}

Se o cliente perguntar sobre status de pedido específico, diga que ele pode ver em "Meus Pedidos" no painel ou enviar o número do pedido para verificação.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas mensagens. Aguarde um momento." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no serviço de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
