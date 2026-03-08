import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { order_id } = await req.json();

    // Fetch order + items + payments
    const { data: order } = await supabase.from("orders").select("*").eq("id", order_id).single();
    if (!order) {
      return new Response(JSON.stringify({ error: "Pedido não encontrado" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: items } = await supabase.from("order_items").select("*").eq("order_id", order_id);
    const { data: payments } = await supabase.from("payments").select("*").eq("order_id", order_id);
    const { data: profile } = await supabase.from("profiles").select("full_name, phone").eq("id", order.client_id).single();

    const totalPaid = (payments ?? []).reduce((sum: number, p: any) => p.type === "refund" ? sum - p.amount : sum + p.amount, 0);

    const context = `
Pedido: ${order.order_number}
Cliente: ${profile?.full_name ?? order.customer_name}
Status: ${order.status}
Total: R$ ${order.total_amount?.toFixed(2)}
Pago: R$ ${totalPaid.toFixed(2)}
Restante: R$ ${(order.total_amount - totalPaid).toFixed(2)}
Itens: ${(items ?? []).map((i: any) => `${i.product_name} (x${i.quantity})`).join(", ")}
`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Você é assistente da "A Ju vai para Miami", personal shopper EUA→Brasil.

TAREFA: Gere uma mensagem de WhatsApp formatada para enviar ao cliente com o resumo do pedido.

REGRAS:
- Use formatação WhatsApp (*negrito*, _itálico_)
- Seja amigável e profissional
- Inclua saudação personalizada com nome do cliente
- Liste os itens do pedido
- Mostre valores (total, pago, restante se houver)
- Inclua status atual
- Finalize com assinatura "A Ju vai para Miami 🌴✈️"
- Máximo 15 linhas
- NÃO use markdown, use formatação WhatsApp`,
          },
          {
            role: "user",
            content: `Gere o resumo WhatsApp para:\n${context}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ message, phone: profile?.phone ?? order.customer_phone }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-order-summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
