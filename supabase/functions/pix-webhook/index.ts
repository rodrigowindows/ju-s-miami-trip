import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only accept POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();

    // OpenPix sends webhook with event type
    // See: https://developers.openpix.com.br/docs/webhook/webhook-overview
    const event = body.event;

    // We only care about completed charges
    if (event !== "OPENPIX:CHARGE_COMPLETED") {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const charge = body.charge;
    if (!charge || !charge.correlationID) {
      return new Response(
        JSON.stringify({ error: "Missing charge data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const correlationID = charge.correlationID;

    // Find the charge in our database
    const { data: pixCharge, error: findError } = await supabaseAdmin
      .from("pix_charges")
      .select("*")
      .eq("correlation_id", correlationID)
      .maybeSingle();

    if (findError || !pixCharge) {
      console.error("Charge not found:", correlationID, findError);
      return new Response(
        JSON.stringify({ error: "Charge not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Already processed
    if (pixCharge.status === "COMPLETED") {
      return new Response(JSON.stringify({ ok: true, already_processed: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update charge status
    await supabaseAdmin
      .from("pix_charges")
      .update({
        status: "COMPLETED",
        transaction_id: charge.transactionID ?? pixCharge.transaction_id,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", pixCharge.id);

    // Create payment record
    await supabaseAdmin.from("payments").insert({
      order_id: pixCharge.order_id,
      type: "deposit",
      amount: pixCharge.value_cents / 100,
      notes: `PIX automático - ${correlationID}`,
    });

    // Update order deposit_paid flag
    await supabaseAdmin
      .from("orders")
      .update({ deposit_paid: true })
      .eq("id", pixCharge.order_id);

    // Log event
    await supabaseAdmin.from("order_events").insert({
      order_id: pixCharge.order_id,
      status: "novo",
      title: "Pagamento PIX confirmado",
      description: `Pagamento de R$ ${(pixCharge.value_cents / 100).toFixed(2)} confirmado automaticamente via PIX.`,
    });

    console.log("PIX payment confirmed:", correlationID, "Order:", pixCharge.order_id);

    return new Response(
      JSON.stringify({ ok: true, order_id: pixCharge.order_id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
