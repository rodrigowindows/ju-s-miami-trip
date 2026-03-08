import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

export default function AdminAISummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("admin-ai-summary");
      if (fnError) throw fnError;
      setSummary(data?.summary ?? "Sem dados para analisar.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar resumo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          Resumo Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!summary && !isLoading && !error && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Gere um resumo executivo com insights do negócio usando IA.
            </p>
            <Button onClick={generate} className="gap-2">
              <Sparkles size={14} />
              Gerar Resumo
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8 gap-2">
            <Loader2 size={18} className="animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Analisando dados...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={generate}>Tentar novamente</Button>
          </div>
        )}

        {summary && !isLoading && (
          <div className="space-y-3">
            <div className="prose prose-sm max-w-none dark:prose-invert [&>h1]:text-base [&>h2]:text-sm [&>p]:text-sm [&>ul]:text-sm">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
            <Button variant="ghost" size="sm" onClick={generate} className="gap-1.5 text-xs text-muted-foreground">
              <RefreshCw size={12} />
              Atualizar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
