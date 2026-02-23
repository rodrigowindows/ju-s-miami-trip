import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { product_id } = await req.json();
    if (!product_id) {
      return new Response(JSON.stringify({ error: "product_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("catalog_products")
      .select("*")
      .eq("id", product_id)
      .eq("active", true)
      .single();

    if (productError || !product) {
      return new Response(JSON.stringify({ error: "Product not found or inactive" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const priceBrl = Math.round(product.price_usd * rate * (1 + spread / 100) * 100) / 100;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        client_id: user.id,
        status: "novo",
        total_usd: product.price_usd,
        total_brl: priceBrl,
      })
      .select()
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabaseAdmin.from("order_items").insert({
      order_id: order.id,
      product_name: product.name,
      product_image_url: product.image_url,
      price_usd: product.price_usd,
      price_brl: priceBrl,
      quantity: 1,
    });

    await supabaseAdmin.from("order_events").insert({
      order_id: order.id,
      event_type: "novo",
      title: "Pedido criado",
      description: `Produto: ${product.name}`,
    });

    return new Response(
      JSON.stringify({ order_id: order.id, order_number: order.order_number }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
