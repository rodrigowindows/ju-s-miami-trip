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

    // Fetch recent reviews
    const { data: reviews } = await supabase
      .from("order_reviews")
      .select("rating, comment, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    // Also fetch product reviews
    const { data: productReviews } = await supabase
      .from("product_reviews")
      .select("rating, comment, created_at, reviewer_name")
      .order("created_at", { ascending: false })
      .limit(100);

    const allReviews = [
      ...(reviews ?? []).map((r: any) => ({ ...r, source: "pedido" })),
      ...(productReviews ?? []).map((r: any) => ({ ...r, source: "produto" })),
    ];

    if (allReviews.length === 0) {
      return new Response(JSON.stringify({
        summary: "Ainda não há avaliações suficientes para análise.",
        sentiment_score: 0,
        highlights: [],
        concerns: [],
        recommendations: [],
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reviewsText = allReviews.map((r: any) =>
      `[${r.source}] ⭐${r.rating} - "${r.comment || 'sem comentário'}"`
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
            content: `Você é um analista de experiência do cliente para "A Ju vai para Miami" (personal shopper EUA→Brasil).

TAREFA: Analise as avaliações e gere um relatório de sentimento.

Retorne APENAS um JSON com esta estrutura:
{
  "summary": "Resumo geral em 2-3 frases",
  "sentiment_score": 0-100 (0=muito negativo, 100=muito positivo),
  "highlights": ["ponto positivo 1", "ponto positivo 2", "ponto positivo 3"],
  "concerns": ["preocupação 1", "preocupação 2"],
  "recommendations": ["sugestão 1", "sugestão 2", "sugestão 3"],
  "trending_keywords": ["palavra-chave 1", "palavra-chave 2"]
}

REGRAS:
- Máximo 3 highlights, 3 concerns, 3 recommendations
- Seja específico baseado nos dados reais
- Retorne APENAS o JSON, sem formatação markdown`,
          },
          {
            role: "user",
            content: `Analise estas ${allReviews.length} avaliações:\n${reviewsText}`,
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
    const raw = data.choices?.[0]?.message?.content ?? "{}";

    let analysis;
    try {
      const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = { summary: raw, sentiment_score: 50, highlights: [], concerns: [], recommendations: [] };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-sentiment-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
