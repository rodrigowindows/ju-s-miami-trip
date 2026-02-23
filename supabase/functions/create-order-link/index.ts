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

    // Parse multipart form data (link + optional file + notes)
    const formData = await req.formData();
    const linkUrl = formData.get("url") as string | null;
    const notes = formData.get("notes") as string | null;
    const file = formData.get("file") as File | null;

    if (!linkUrl && !file) {
      return new Response(
        JSON.stringify({ error: "Either url or file is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate URL format if provided
    if (linkUrl) {
      try {
        new URL(linkUrl);
      } catch {
        return new Response(JSON.stringify({ error: "Invalid URL format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    let imageUrl: string | null = null;

    // Upload file if provided (validate type and size server-side)
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
      if (!allowedTypes.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: "File must be an image (JPEG, PNG, WebP, HEIC)" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return new Response(
          JSON.stringify({ error: "File too large (max 10MB)" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("order-attachments")
        .upload(path, file);

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage
          .from("order-attachments")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }
    }

    // Create order
    const orderNotes = [linkUrl && `URL: ${linkUrl}`, notes]
      .filter(Boolean)
      .join("\n");

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        client_id: user.id,
        status: "novo",
        notes: orderNotes || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create order item
    await supabaseAdmin.from("order_items").insert({
      order_id: order.id,
      product_name: linkUrl || "Produto via screenshot",
      product_url: linkUrl || null,
      product_image_url: imageUrl,
      quantity: 1,
      notes: notes || null,
    });

    // Create initial event
    await supabaseAdmin.from("order_events").insert({
      order_id: order.id,
      event_type: "novo",
      title: "Pedido criado via link/screenshot",
      description: linkUrl || "Produto enviado via imagem",
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
