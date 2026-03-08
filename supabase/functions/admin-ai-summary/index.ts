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

    // Fetch recent orders summary
    const { data: orders } = await supabase
      .from("orders")
      .select("status, total_amount, created_at, customer_name")
      .order("created_at", { ascending: false })
      .limit(100);

    // Fetch recent payments
    const { data: payments } = await supabase
      .from("payments")
      .select("amount, type, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    // Fetch reviews
    const { data: reviews } = await supabase
      .from("order_reviews")
      .select("rating, comment, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    const dataContext = JSON.stringify({
      orders_summary: {
        total: orders?.length ?? 0,
        by_status: orders?.reduce((acc: Record<string, number>, o) => {
          acc[o.status] = (acc[o.status] ?? 0) + 1;
          return acc;
        }, {}),
        total_revenue: orders?.reduce((sum, o) => sum + (o.total_amount ?? 0), 0),
        recent_orders: orders?.slice(0, 10).map(o => ({
          status: o.status,
          amount: o.total_amount,
          customer: o.customer_name,
          date: o.created_at,
        })),
      },
      payments_summary: {
        total_received: payments?.filter(p => p.type !== 'refund').reduce((s, p) => s + p.amount, 0),
        refunds: payments?.filter(p => p.type === 'refund').reduce((s, p) => s + p.amount, 0),
      },
      reviews_summary: {
        count: reviews?.length ?? 0,
        avg_rating: reviews && reviews.length > 0 
          ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) 
          : 0,
        recent_comments: reviews?.filter(r => r.comment).slice(0, 5).map(r => ({
          rating: r.rating,
          comment: r.comment,
        })),
      },
    });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `Você é um analista de negócios da "A Ju vai para Miami". Gere um resumo executivo em português brasileiro com insights acionáveis.

Formato do resumo:
1. **Visão Geral** - Números principais (pedidos, receita, ticket médio)
2. **Destaques** - O que está indo bem
3. **Alertas** - Pontos que precisam de atenção
4. **Ações Sugeridas** - 2-3 ações concretas para melhorar

Use emojis para destacar. Seja direto e objetivo.`,
          },
          {
            role: "user",
            content: `Analise estes dados do negócio e gere o resumo:\n\n${dataContext}`,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao gerar resumo" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const summary = result.choices?.[0]?.message?.content ?? "Não foi possível gerar o resumo.";

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
