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

// ── Batched event queue (fire-and-forget, debounced) ─────
let eventQueue: Parameters<typeof supabase.from>[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function enqueueEvent(row: Record<string, unknown>) {
  eventQueue.push(row as any);
  if (!flushTimer) {
    flushTimer = setTimeout(flushEvents, 2000);
  }
}

function flushEvents() {
  flushTimer = null;
  if (eventQueue.length === 0) return;
  const batch = [...eventQueue];
  eventQueue = [];
  supabase
    .from("site_events")
    .insert(batch as any)
    .then(() => {});
}

// ── Hook ─────────────────────────────────────────────────
export function useAnalytics() {
  const { user } = useAuth();
  const userId = user?.id;

  const track = useCallback(
    (eventType: EventType, payload: EventPayload = {}) => {
      enqueueEvent({
        event_type: eventType,
        visitor_id: getVisitorId(),
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
      });
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
