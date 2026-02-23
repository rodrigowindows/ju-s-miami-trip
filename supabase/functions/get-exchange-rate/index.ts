import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: settings } = await supabaseAdmin
      .from("settings")
      .select("key, value")
      .in("key", ["exchange_rate_usd_brl", "spread_percentage"]);

    let rate = 6.05;
    let spread = 8;
    if (settings) {
      for (const row of settings) {
        if (row.key === "exchange_rate_usd_brl") rate = parseFloat(row.value);
        if (row.key === "spread_percentage") spread = parseFloat(row.value);
      }
    }

    // Parse optional amount parameter
    const url = new URL(req.url);
    const amountUsd = parseFloat(url.searchParams.get("amount") || "0");

    const response: Record<string, unknown> = {
      rate,
      spread_percentage: spread,
      effective_rate: rate * (1 + spread / 100),
    };

    if (amountUsd > 0) {
      response.amount_usd = amountUsd;
      response.amount_brl =
        Math.round(amountUsd * rate * (1 + spread / 100) * 100) / 100;
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
