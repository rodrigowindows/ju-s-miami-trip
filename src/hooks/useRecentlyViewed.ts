import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "ajuvaiparamiami_recently_viewed";
const MAX_ITEMS = 10;

function getStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useRecentlyViewed() {
  const [ids, setIds] = useState<string[]>(getStored);

  useEffect(() => {
    const handler = () => setIds(getStored());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addViewed = useCallback((productId: string) => {
    setIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const next = [productId, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentIds: ids, addViewed };
}
