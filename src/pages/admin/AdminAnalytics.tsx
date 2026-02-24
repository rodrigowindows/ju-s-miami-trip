import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Search, TrendingUp, BarChart3, AlertCircle, Eye,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const COLORS = ["#F97316", "#3B82F6", "#22C55E", "#EAB308", "#8B5CF6", "#EC4899", "#14B8A6", "#EF4444"];
const PERIOD_OPTIONS = [
  { value: "7", label: "7 dias" },
  { value: "30", label: "30 dias" },
  { value: "90", label: "90 dias" },
];

type SearchQuery = {
  id: string;
  query: string;
  source: string;
  user_id: string | null;
  results_count: number;
  created_at: string;
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-gray-600">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("30");

  const since = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - Number(period));
    return d.toISOString();
  }, [period]);

  const { data: searches, isLoading } = useQuery({
    queryKey: ["search-queries", period],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("search_queries")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as SearchQuery[];
    },
  });

  const stats = useMemo(() => {
    if (!searches) return null;

    // Top terms
    const termMap = new Map<string, { count: number; zeroResults: number }>();
    for (const s of searches) {
      const existing = termMap.get(s.query) || { count: 0, zeroResults: 0 };
      existing.count++;
      if (s.results_count === 0) existing.zeroResults++;
      termMap.set(s.query, existing);
    }
    const topTerms = [...termMap.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 15)
      .map(([term, data]) => ({ term, ...data }));

    // Zero-results terms
    const zeroResultsTerms = [...termMap.entries()]
      .filter(([, data]) => data.zeroResults > 0)
      .sort((a, b) => b[1].zeroResults - a[1].zeroResults)
      .slice(0, 10)
      .map(([term, data]) => ({ term, count: data.zeroResults }));

    // Volume by day
    const dayMap = new Map<string, number>();
    for (const s of searches) {
      const day = new Date(s.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    }
    const dailyVolume = [...dayMap.entries()]
      .map(([day, count]) => ({ day, count }))
      .reverse();

    // Source breakdown
    const sourceMap = new Map<string, number>();
    for (const s of searches) {
      const src = s.source === "client" ? "Logado" : "Visitante";
      sourceMap.set(src, (sourceMap.get(src) || 0) + 1);
    }
    const sourceBreakdown = [...sourceMap.entries()].map(([name, value]) => ({ name, value }));

    // Unique users who searched
    const uniqueUsers = new Set(searches.filter((s) => s.user_id).map((s) => s.user_id)).size;

    return {
      total: searches.length,
      uniqueTerms: termMap.size,
      uniqueUsers,
      zeroResultsCount: searches.filter((s) => s.results_count === 0).length,
      topTerms,
      zeroResultsTerms,
      dailyVolume,
      sourceBreakdown,
    };
  }, [searches]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 size={22} />
            Analytics de Busca
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe o que seus clientes estão buscando
          </p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Search size={14} />
              <span className="text-xs font-medium">Total de Buscas</span>
            </div>
            <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp size={14} />
              <span className="text-xs font-medium">Termos Únicos</span>
            </div>
            <p className="text-2xl font-bold">{stats?.uniqueTerms ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Eye size={14} />
              <span className="text-xs font-medium">Usuários Buscando</span>
            </div>
            <p className="text-2xl font-bold">{stats?.uniqueUsers ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <AlertCircle size={14} />
              <span className="text-xs font-medium">Sem Resultado</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats?.zeroResultsCount ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Search Volume Over Time */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Volume de Buscas por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            {(stats?.dailyVolume?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats!.dailyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Buscas"
                    stroke="#F97316"
                    fill="#F97316"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                Nenhuma busca registrada neste período.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Source Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Origem das Buscas</CardTitle>
          </CardHeader>
          <CardContent>
            {(stats?.sourceBreakdown?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats!.sourceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {stats!.sourceBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                Sem dados.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Terms & Zero Results */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Searched Terms */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp size={16} />
              Termos Mais Buscados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(stats?.topTerms?.length ?? 0) > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {stats!.topTerms.map((t, i) => (
                    <div key={t.term} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-5 text-right">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{t.term}</span>
                          {t.zeroResults > 0 && (
                            <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                              {t.zeroResults}x sem resultado
                            </Badge>
                          )}
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                          <div
                            className="h-1.5 rounded-full bg-primary transition-all"
                            style={{
                              width: `${(t.count / stats!.topTerms[0].count) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {t.count}x
                      </Badge>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={stats!.topTerms.slice(0, 10)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                    <YAxis
                      dataKey="term"
                      type="category"
                      width={80}
                      tick={{ fontSize: 9 }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" name="Buscas" fill="#F97316" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                Nenhuma busca registrada.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Zero Results */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              Buscas Sem Resultado
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Oportunidades: produtos que seus clientes procuram mas não encontram
            </p>
          </CardHeader>
          <CardContent>
            {(stats?.zeroResultsTerms?.length ?? 0) > 0 ? (
              <div className="space-y-2">
                {stats!.zeroResultsTerms.map((t, i) => (
                  <div
                    key={t.term}
                    className="flex items-center justify-between gap-3 p-2.5 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-red-400 w-5 text-right shrink-0">
                        {i + 1}
                      </span>
                      <Search size={14} className="text-red-400 shrink-0" />
                      <span className="text-sm font-medium text-red-800 truncate">
                        "{t.term}"
                      </span>
                    </div>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shrink-0">
                      {t.count}x
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <AlertCircle size={32} className="mx-auto text-green-400 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Todas as buscas retornaram resultados!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Searches Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Buscas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium text-muted-foreground text-xs">Termo</th>
                  <th className="pb-2 font-medium text-muted-foreground text-xs">Origem</th>
                  <th className="pb-2 font-medium text-muted-foreground text-xs">Resultados</th>
                  <th className="pb-2 font-medium text-muted-foreground text-xs">Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {(searches ?? []).slice(0, 30).map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{s.query}</td>
                    <td className="py-2">
                      <Badge variant={s.source === "client" ? "default" : "secondary"} className="text-[10px]">
                        {s.source === "client" ? "Logado" : "Visitante"}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <span className={s.results_count === 0 ? "text-red-600 font-semibold" : ""}>
                        {s.results_count}
                      </span>
                    </td>
                    <td className="py-2 text-muted-foreground text-xs">
                      {new Date(s.created_at).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!searches || searches.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma busca registrada neste período.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
