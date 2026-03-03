import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ── Event types ──────────────────────────────────────────
export type EventType =
  | "page_view"
  | "product_click"
  | "product_view"
  | "add_to_cart"
  | "buy_click"
  | "whatsapp_click"
  | "share_click"
  | "wishlist_toggle"
  | "checkout_start"
  | "banner_click";

export interface EventPayload {
  product_id?: string;
  product_name?: string;
  product_brand?: string;
  product_category?: string;
  product_price_brl?: number;
  page_path?: string;
  metadata?: Record<string, unknown>;
}

// ── Visitor ID (persistent anonymous identifier) ─────────
const VISITOR_KEY = "ajuvaiparamiami_vid";

function getVisitorId(): string {
  let vid = localStorage.getItem(VISITOR_KEY);
  if (!vid) {
    vid = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, vid);
  }
  return vid;
}

// ── Fire-and-forget event sender ─────────────────────────
function sendEvent(
  eventType: EventType,
  userId: string | undefined,
  payload: EventPayload = {}
) {
  const visitorId = getVisitorId();

  (supabase as any)
    .from("site_events")
    .insert({
      event_type: eventType,
      visitor_id: visitorId,
      user_id: userId || null,
      product_id: payload.product_id || null,
      product_name: payload.product_name || null,
      product_brand: payload.product_brand || null,
      product_category: payload.product_category || null,
      product_price_brl: payload.product_price_brl || null,
      page_path: payload.page_path || window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      screen_width: window.innerWidth,
      metadata: payload.metadata || {},
    })
    .then(() => {});
}

// ── Hook ─────────────────────────────────────────────────
export function useAnalytics() {
  const { user } = useAuth();
  const userId = user?.id;

  const track = useCallback(
    (eventType: EventType, payload: EventPayload = {}) => {
      sendEvent(eventType, userId, payload);
    },
    [userId]
  );

  return { track, visitorId: getVisitorId() };
}

// ── Auto page-view hook (use once per page component) ────
export function usePageView(pageName?: string) {
  const { track } = useAnalytics();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    track("page_view", {
      page_path: window.location.pathname,
      metadata: { page_name: pageName || document.title },
    });
  }, [track, pageName]);
}
