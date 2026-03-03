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

    // Verify user
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

    const { order_id, value_brl } = await req.json();
    if (!order_id || !value_brl) {
      return new Response(
        JSON.stringify({ error: "order_id and value_brl are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify order belongs to user
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, client_id, order_number")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.client_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if there's already an active charge for this order
    const { data: existingCharge } = await supabaseAdmin
      .from("pix_charges")
      .select("*")
      .eq("order_id", order_id)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (existingCharge) {
      return new Response(
        JSON.stringify({
          charge_id: existingCharge.id,
          correlation_id: existingCharge.correlation_id,
          br_code: existingCharge.br_code,
          qr_code_image: existingCharge.qr_code_image,
          status: existingCharge.status,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const OPENPIX_APP_ID = Deno.env.get("OPENPIX_APP_ID");
    if (!OPENPIX_APP_ID) {
      return new Response(
        JSON.stringify({ error: "PIX gateway not configured" }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const correlationID = `order-${order.order_number}-${Date.now()}`;
    const valueCents = Math.round(value_brl * 100);

    // Create charge on OpenPix
    const openpixRes = await fetch("https://api.openpix.com.br/api/v1/charge", {
      method: "POST",
      headers: {
        Authorization: OPENPIX_APP_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correlationID,
        value: valueCents,
        comment: `Pedido ${order.order_number} - AjuVaiParaMiami`,
        expiresIn: 3600, // 1 hour
      }),
    });

    if (!openpixRes.ok) {
      const errBody = await openpixRes.text();
      console.error("OpenPix error:", errBody);
      return new Response(
        JSON.stringify({ error: "Failed to create PIX charge" }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openpixData = await openpixRes.json();
    const charge = openpixData.charge;

    // Save charge to database
    const { data: pixCharge, error: insertError } = await supabaseAdmin
      .from("pix_charges")
      .insert({
        order_id,
        correlation_id: correlationID,
        transaction_id: charge.transactionID ?? null,
        status: "ACTIVE",
        value_cents: valueCents,
        br_code: charge.brCode ?? null,
        qr_code_image: charge.qrCodeImage ?? null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("DB insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save charge" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        charge_id: pixCharge.id,
        correlation_id: pixCharge.correlation_id,
        br_code: pixCharge.br_code,
        qr_code_image: pixCharge.qr_code_image,
        status: pixCharge.status,
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
