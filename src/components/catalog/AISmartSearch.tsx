import { useState, useCallback } from "react";
import { Sparkles, Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onResults: (productIds: string[]) => void;
  onClear: () => void;
}

export default function AISmartSearch({ onResults, onClear }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-smart-search", {
        body: { query: query.trim() },
      });
      if (error) throw error;
      onResults(data?.product_ids ?? []);
    } catch {
      onResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, onResults]);

  const handleClear = () => {
    setQuery("");
    setHasSearched(false);
    onClear();
  };

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Sparkles size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Busca inteligente: 'perfume feminino até $50', 'presente para mãe'..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={loading || !query.trim()}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
        {loading ? "Buscando..." : "Buscar com IA"}
      </button>
      {hasSearched && (
        <button onClick={handleClear} className="text-xs text-muted-foreground hover:text-foreground underline">
          Limpar
        </button>
      )}
    </div>
  );
}
