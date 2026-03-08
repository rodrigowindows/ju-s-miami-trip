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

    const { query } = await req.json();

    // Fetch all active products for context
    const { data: products } = await supabase
      .from("catalog_products")
      .select("id, name, brand, category, price_usd, description, availability_type")
      .eq("active", true)
      .limit(500);

    const productList = (products ?? []).map((p: any) =>
      `[${p.id}] ${p.name} | ${p.brand} | ${p.category} | US$${p.price_usd} | ${p.availability_type}`
    ).join("\n");

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
            content: `Você é um assistente de busca inteligente para a loja "A Ju vai para Miami" (personal shopper EUA→Brasil).

O cliente fará buscas em linguagem natural como:
- "perfume feminino até 50 dólares"
- "creme para pele seca"
- "presente para namorada"
- "nike mais vendido"

TAREFA: Retorne os IDs dos produtos mais relevantes para a busca, ordenados por relevância.

REGRAS:
- Retorne APENAS um JSON array com os IDs dos produtos relevantes
- Máximo 20 resultados
- Se nenhum produto for relevante, retorne []
- Considere sinônimos, contexto e intenção do usuário
- Formato: ["id1", "id2", "id3"]
- NÃO inclua explicações, APENAS o array JSON`,
          },
          {
            role: "user",
            content: `Busca: "${query}"\n\nProdutos disponíveis:\n${productList}`,
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
    const raw = data.choices?.[0]?.message?.content ?? "[]";

    // Parse the JSON array from the response
    let productIds: string[] = [];
    try {
      const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      productIds = JSON.parse(cleaned);
    } catch {
      productIds = [];
    }

    return new Response(JSON.stringify({ product_ids: productIds }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-smart-search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
