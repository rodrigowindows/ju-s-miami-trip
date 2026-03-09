import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not set");

    const { products } = await req.json();
    if (!products || products.length < 2) {
      return new Response(JSON.stringify({ error: "Envie ao menos 2 produtos para comparar." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const productList = products.slice(0, 3).map((p: any, i: number) =>
      `${i + 1}. ${p.name} (${p.brand}) - US$ ${p.price_usd} - ${p.category}`
    ).join("\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `Você é especialista em produtos americanos. Compare os produtos abaixo em português brasileiro.
Use markdown formatado com:
- Tabela comparativa
- Prós e contras de cada
- Melhor custo-benefício
- Recomendação por perfil (presente, uso pessoal, revenda)
Seja objetivo e útil.`
          },
          { role: "user", content: `Compare estes produtos:\n${productList}` }
        ],
        temperature: 0.4,
      }),
    });

    if (response.status === 429) return new Response(JSON.stringify({ error: "Muitas requisições." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!response.ok) throw new Error(`AI error: ${response.status}`);

    const data = await response.json();
    const comparison = data.choices?.[0]?.message?.content || "Não foi possível gerar a comparação.";

    return new Response(JSON.stringify({ comparison }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
