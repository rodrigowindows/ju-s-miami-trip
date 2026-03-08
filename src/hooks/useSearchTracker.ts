import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const DEBOUNCE_MS = 1500;
const MIN_QUERY_LENGTH = 2;

/**
 * Tracks search queries as site_events with type "search".
 * Uses debounce to avoid flooding the database.
 */
export function useSearchTracker(source: "public" | "client", userId?: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef("");

  const track = useCallback(
    (query: string, resultsCount: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const trimmed = query.trim().toLowerCase();
      if (trimmed.length < MIN_QUERY_LENGTH) return;

      timerRef.current = setTimeout(() => {
        if (trimmed === lastSavedRef.current) return;
        lastSavedRef.current = trimmed;

        const vid = localStorage.getItem("ajuvaiparamiami_vid") || "unknown";
        supabase
          .from("site_events")
          .insert({
            event_type: "search",
            visitor_id: vid,
            user_id: userId || null,
            page_path: window.location.pathname,
            user_agent: navigator.userAgent,
            screen_width: window.innerWidth,
            metadata: { query: trimmed, source, results_count: resultsCount },
          })
          .then(() => {});
      }, DEBOUNCE_MS);
    },
    [source, userId]
  );

  return track;
}
