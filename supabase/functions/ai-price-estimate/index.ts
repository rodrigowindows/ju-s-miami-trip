import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { product_name, price_usd, weight_kg, category } = await req.json();

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
            content: `Você é um calculador de custos de importação para personal shopper Miami → Brasil.

Use estas regras:
- Câmbio: usar taxa do dia (~5.80 BRL/USD) + spread de 5%
- Taxa de serviço: 15% sobre preço USD
- Peso estimado: se não informado, estimar baseado na categoria
  - Perfumes/Mists: 0.3-0.5 kg
  - Suplementos: 0.3-0.8 kg  
  - Eletrônicos: 0.5-2.0 kg
  - Roupas/Acessórios: 0.3-1.0 kg
- Frete por peso: R$15/kg (rateio)

Retorne a estimativa detalhada via tool call.`,
          },
          {
            role: "user",
            content: `Produto: ${product_name}\nPreço USD: $${price_usd}\nPeso: ${weight_kg ? weight_kg + "kg" : "estimar"}\nCategoria: ${category}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "price_estimate",
              description: "Return detailed price estimate",
              parameters: {
                type: "object",
                properties: {
                  price_usd: { type: "number" },
                  exchange_rate: { type: "number" },
                  price_brl_base: { type: "number", description: "USD * rate" },
                  service_fee_brl: { type: "number", description: "15% service fee in BRL" },
                  shipping_fee_brl: { type: "number", description: "Weight-based shipping" },
                  total_brl: { type: "number", description: "Final total in BRL" },
                  estimated_weight_kg: { type: "number" },
                  breakdown_text: { type: "string", description: "Human readable breakdown in Portuguese" },
                },
                required: ["price_usd", "exchange_rate", "price_brl_base", "service_fee_brl", "shipping_fee_brl", "total_brl", "estimated_weight_kg", "breakdown_text"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "price_estimate" } },
      }),
    });

    if (!response.ok) {
      // Fallback calculation
      const rate = 5.80 * 1.05;
      const baseBrl = price_usd * rate;
      const serviceFee = price_usd * 0.15 * rate;
      const estWeight = weight_kg || 0.5;
      const shippingFee = estWeight * 15;
      const total = baseBrl + serviceFee + shippingFee;

      return new Response(JSON.stringify({
        price_usd,
        exchange_rate: rate,
        price_brl_base: Math.round(baseBrl * 100) / 100,
        service_fee_brl: Math.round(serviceFee * 100) / 100,
        shipping_fee_brl: Math.round(shippingFee * 100) / 100,
        total_brl: Math.round(total * 100) / 100,
        estimated_weight_kg: estWeight,
        breakdown_text: `Preço base: R$${baseBrl.toFixed(2)} | Taxa de serviço: R$${serviceFee.toFixed(2)} | Frete: R$${shippingFee.toFixed(2)}`,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const estimate = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(estimate), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("AI did not return estimate");
  } catch (e) {
    console.error("ai-price error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
