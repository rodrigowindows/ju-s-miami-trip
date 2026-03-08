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

    const { viewed_ids, current_product_id, category } = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch viewed products
    let viewedProducts: any[] = [];
    if (viewed_ids?.length) {
      const { data } = await supabase
        .from("catalog_products")
        .select("id, name, brand, category, price_usd")
        .in("id", viewed_ids.slice(0, 10));
      viewedProducts = data ?? [];
    }

    // Fetch all active products
    const { data: allProducts } = await supabase
      .from("catalog_products")
      .select("id, name, brand, category, price_usd, rating, sales_count, trending")
      .eq("active", true)
      .limit(200);

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
            content: "Você é um sistema de recomendação de produtos. Retorne APENAS um JSON array com os IDs dos 6 produtos mais relevantes para recomendar. Considere: produtos da mesma categoria, marca semelhante, faixa de preço similar, popularidade. Não inclua o produto atual nem os já vistos.",
          },
          {
            role: "user",
            content: JSON.stringify({
              viewed: viewedProducts,
              current_product_id,
              current_category: category,
              available: allProducts,
            }),
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_products",
              description: "Return recommended product IDs",
              parameters: {
                type: "object",
                properties: {
                  product_ids: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of recommended product UUIDs",
                  },
                },
                required: ["product_ids"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "recommend_products" } },
      }),
    });

    if (!response.ok) {
      // Fallback: return trending/popular products
      const fallback = (allProducts ?? [])
        .filter(p => p.id !== current_product_id && !viewed_ids?.includes(p.id))
        .sort((a, b) => (b.sales_count + (b.trending ? 100 : 0)) - (a.sales_count + (a.trending ? 100 : 0)))
        .slice(0, 6)
        .map(p => p.id);
      
      return new Response(JSON.stringify({ product_ids: fallback }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    let productIds: string[] = [];

    if (toolCall?.function?.arguments) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        productIds = args.product_ids ?? [];
      } catch {
        productIds = [];
      }
    }

    // Fallback if AI returned empty
    if (productIds.length === 0) {
      productIds = (allProducts ?? [])
        .filter(p => p.id !== current_product_id && !viewed_ids?.includes(p.id))
        .sort((a, b) => (b.sales_count + (b.trending ? 100 : 0)) - (a.sales_count + (a.trending ? 100 : 0)))
        .slice(0, 6)
        .map(p => p.id);
    }

    return new Response(JSON.stringify({ product_ids: productIds }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-recommend error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
