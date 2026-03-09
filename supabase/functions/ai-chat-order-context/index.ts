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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not set");

    const { messages, user_id } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Detect order numbers in conversation
    const allText = messages.map((m: any) => m.content).join(" ");
    const orderPattern = /PED-\d{3,6}/gi;
    const orderNumbers = [...new Set(allText.match(orderPattern) || [])];

    let orderContext = "";
    if (orderNumbers.length > 0) {
      for (const num of orderNumbers.slice(0, 3)) {
        const { data: order } = await supabase
          .from("orders")
          .select("id, order_number, status, items, total_amount, created_at, customer_name")
          .eq("order_number", num)
          .maybeSingle();

        if (order) {
          const { data: items } = await supabase.from("order_items").select("product_name, quantity, price_usd").eq("order_id", order.id);
          const { data: events } = await supabase.from("order_events").select("title, status, created_at").eq("order_id", order.id).order("created_at", { ascending: false }).limit(5);

          const statusMap: Record<string, string> = {
            novo: "Novo", orcamento: "Em Orçamento", aprovado: "Aprovado",
            comprando: "Comprando nos EUA", comprado: "Comprado",
            em_transito: "Em Trânsito", chegou_brasil: "Chegou ao Brasil",
            entregue: "Entregue", cancelado: "Cancelado"
          };

          orderContext += `\n--- Pedido ${order.order_number} ---\n`;
          orderContext += `Status: ${statusMap[order.status] || order.status}\n`;
          orderContext += `Total: R$ ${order.total_amount}\n`;
          orderContext += `Data: ${new Date(order.created_at).toLocaleDateString("pt-BR")}\n`;
          if (items?.length) orderContext += `Itens: ${items.map(i => `${i.quantity}x ${i.product_name}`).join(", ")}\n`;
          if (events?.length) orderContext += `Histórico: ${events.map(e => `${e.title} (${new Date(e.created_at).toLocaleDateString("pt-BR")})`).join(" → ")}\n`;
        }
      }
    }

    const systemPrompt = `Você é a assistente virtual da "A Ju vai para Miami", serviço de personal shopper.
Responda em português brasileiro, de forma amigável e objetiva.
${orderContext ? `\nDados reais dos pedidos do cliente:\n${orderContext}` : ""}
Se o cliente perguntar sobre um pedido e você tiver os dados acima, use-os. Caso contrário, peça o número do pedido (formato PED-XXXXX).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (response.status === 429) return new Response(JSON.stringify({ error: "Muitas mensagens. Aguarde." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!response.ok) throw new Error(`AI error: ${response.status}`);

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
