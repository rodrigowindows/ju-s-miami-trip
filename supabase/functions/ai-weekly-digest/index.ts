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

    const { client_id } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get client profile
    const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", client_id).maybeSingle();

    // Get wishlist with products
    const { data: wishlist } = await supabase
      .from("wishlists")
      .select("catalog_products(name, brand, price_usd, category)")
      .eq("client_id", client_id)
      .limit(10);

    // Get recent orders
    const { data: orders } = await supabase
      .from("orders")
      .select("order_number, status, items, total_amount, created_at")
      .eq("client_id", client_id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Get active promotions
    const { data: promos } = await supabase
      .from("promotions")
      .select("name, coupon_code, discount_type, discount_value, expires_at")
      .eq("active", true)
      .gte("expires_at", new Date().toISOString())
      .limit(5);

    const wishlistItems = wishlist?.map((w: any) => w.catalog_products).filter(Boolean) || [];
    const clientName = profile?.full_name || "Cliente";

    const context = JSON.stringify({ clientName, wishlistItems, recentOrders: orders || [], activePromos: promos || [] });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `Você é a copywriter da "A Ju vai para Miami". Gere um resumo semanal personalizado para enviar via WhatsApp/email.
Inclua: saudação personalizada, status de pedidos recentes, produtos na wishlist com sugestão de compra, promoções ativas.
Tom: amigável, empolgante, com emojis. Formato: texto curto e escaneável.
Responda em JSON: {"whatsapp_message":"...","email_subject":"...","email_body":"..."}`
          },
          { role: "user", content: `Dados do cliente:\n${context}` }
        ],
        temperature: 0.6,
      }),
    });

    if (response.status === 429) return new Response(JSON.stringify({ error: "Muitas requisições." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!response.ok) throw new Error(`AI error: ${response.status}`);

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
