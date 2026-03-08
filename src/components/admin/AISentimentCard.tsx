import { useState } from "react";
import { Sparkles, Loader2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Lightbulb, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SentimentData {
  summary: string;
  sentiment_score: number;
  highlights: string[];
  concerns: string[];
  recommendations: string[];
  trending_keywords?: string[];
}

export default function AISentimentCard() {
  const [data, setData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function analyze() {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("ai-sentiment-analysis");
      if (error) throw error;
      setData(result as SentimentData);
    } catch (e: any) {
      toast({ title: "Erro na análise", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-4 text-center space-y-3">
          <Sparkles size={28} className="mx-auto text-primary" />
          <p className="text-sm font-medium">Análise de Sentimento IA</p>
          <p className="text-xs text-muted-foreground">Analise automaticamente o sentimento das avaliações dos clientes</p>
          <Button onClick={analyze} disabled={loading} className="gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loading ? "Analisando..." : "Analisar Avaliações"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const scoreColor = data.sentiment_score >= 70 ? "text-emerald-600" : data.sentiment_score >= 40 ? "text-amber-600" : "text-red-600";
  const progressColor = data.sentiment_score >= 70 ? "bg-emerald-500" : data.sentiment_score >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Análise de Sentimento IA
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={analyze} disabled={loading} className="gap-1 text-xs">
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className={`text-3xl font-bold ${scoreColor}`}>{data.sentiment_score}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Score</p>
          </div>
          <div className="flex-1">
            <Progress value={data.sentiment_score} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{data.summary}</p>
          </div>
        </div>

        {/* Highlights */}
        {data.highlights.length > 0 && (
          <div>
            <p className="text-xs font-semibold flex items-center gap-1 mb-1.5 text-emerald-700">
              <CheckCircle2 size={12} /> Pontos Positivos
            </p>
            <div className="space-y-1">
              {data.highlights.map((h, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <TrendingUp size={10} className="mt-0.5 text-emerald-500 shrink-0" /> {h}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Concerns */}
        {data.concerns.length > 0 && (
          <div>
            <p className="text-xs font-semibold flex items-center gap-1 mb-1.5 text-amber-700">
              <AlertTriangle size={12} /> Pontos de Atenção
            </p>
            <div className="space-y-1">
              {data.concerns.map((c, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <TrendingDown size={10} className="mt-0.5 text-amber-500 shrink-0" /> {c}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div>
            <p className="text-xs font-semibold flex items-center gap-1 mb-1.5 text-primary">
              <Lightbulb size={12} /> Recomendações
            </p>
            <div className="space-y-1">
              {data.recommendations.map((r, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary shrink-0">→</span> {r}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        {data.trending_keywords && data.trending_keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.trending_keywords.map((kw, i) => (
              <Badge key={i} variant="secondary" className="text-[10px] gap-0.5">
                <Hash size={8} /> {kw}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
