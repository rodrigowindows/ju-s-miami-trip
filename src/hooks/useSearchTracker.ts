import { useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const DEBOUNCE_MS = 1500;
const MIN_QUERY_LENGTH = 2;

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

        supabase
          .from("search_queries")
          .insert({
            query: trimmed,
            source,
            user_id: userId || null,
            results_count: resultsCount,
          })
          .then(() => {});
      }, DEBOUNCE_MS);
    },
    [source, userId]
  );

  return track;
}
