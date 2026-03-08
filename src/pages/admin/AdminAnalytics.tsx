import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2, Search, TrendingUp, BarChart3, AlertCircle, Eye,
  Users, MousePointerClick, ShoppingCart, MessageCircle, Share2,
  Smartphone, Monitor, ArrowDown,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  FunnelChart, Funnel, LabelList,
} from "recharts";

const COLORS = ["#F97316", "#3B82F6", "#22C55E", "#EAB308", "#8B5CF6", "#EC4899", "#14B8A6", "#EF4444"];
const FUNNEL_COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF", "#EC4899"];
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

type SiteEvent = {
  id: string;
  event_type: string;
  visitor_id: string;
  user_id: string | null;
  product_id: string | null;
  product_name: string | null;
  product_brand: string | null;
  product_category: string | null;
  product_price_brl: number | null;
  page_path: string | null;
  referrer: string | null;
  screen_width: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type TabKey = "funnel" | "products" | "search";

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
  const [tab, setTab] = useState<TabKey>("funnel");

  const since = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - Number(period));
    return d.toISOString();
  }, [period]);

  // ── Fetch search queries ─────────────────────────────
  const { data: searches, isLoading: searchLoading } = useQuery({
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

  // ── Fetch site events ────────────────────────────────
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["site-events", period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_events")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as SiteEvent[];
    },
  });

  const isLoading = searchLoading || eventsLoading;

  // ── Compute event stats ──────────────────────────────
  const eventStats = useMemo(() => {
    if (!events) return null;

    const byType = (type: string) => events.filter((e) => e.event_type === type);
    const pageViews = byType("page_view");
    const productClicks = byType("product_click");
    const productViews = byType("product_view");
    const addToCarts = byType("add_to_cart");
    const buyClicks = byType("buy_click");
    const whatsappClicks = byType("whatsapp_click");
    const shareClicks = byType("share_click");

    // Unique visitors
    const uniqueVisitors = new Set(events.map((e) => e.visitor_id)).size;

    // Daily visitors
    const dayVisitorMap = new Map<string, Set<string>>();
    const dayEventMap = new Map<string, number>();
    for (const e of events) {
      const day = new Date(e.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      if (!dayVisitorMap.has(day)) dayVisitorMap.set(day, new Set());
      dayVisitorMap.get(day)!.add(e.visitor_id);
      dayEventMap.set(day, (dayEventMap.get(day) || 0) + 1);
    }
    const dailyVisitors = [...dayVisitorMap.entries()]
      .map(([day, visitors]) => ({ day, visitors: visitors.size, events: dayEventMap.get(day) || 0 }))
      .reverse();

    // Funnel data
    const funnelData = [
      { name: "Visitaram o site", value: uniqueVisitors, fill: FUNNEL_COLORS[0] },
      { name: "Clicaram em produto", value: new Set(productClicks.map((e) => e.visitor_id)).size, fill: FUNNEL_COLORS[1] },
      { name: "Viram página produto", value: new Set(productViews.map((e) => e.visitor_id)).size, fill: FUNNEL_COLORS[2] },
      { name: "Adicionaram ao carrinho", value: new Set(addToCarts.map((e) => e.visitor_id)).size, fill: FUNNEL_COLORS[3] },
      { name: "Clicaram Comprar", value: new Set(buyClicks.map((e) => e.visitor_id)).size, fill: FUNNEL_COLORS[4] },
      { name: "WhatsApp", value: new Set(whatsappClicks.map((e) => e.visitor_id)).size, fill: FUNNEL_COLORS[5] },
    ];

    // Top clicked products
    const productClickMap = new Map<string, { name: string; brand: string; category: string; clicks: number; views: number; carts: number }>();
    for (const e of [...productClicks, ...productViews, ...addToCarts]) {
      if (!e.product_name) continue;
      const key = e.product_id || e.product_name;
      const existing = productClickMap.get(key) || { name: e.product_name, brand: e.product_brand || "", category: e.product_category || "", clicks: 0, views: 0, carts: 0 };
      if (e.event_type === "product_click") existing.clicks++;
      if (e.event_type === "product_view") existing.views++;
      if (e.event_type === "add_to_cart") existing.carts++;
      productClickMap.set(key, existing);
    }
    const topProducts = [...productClickMap.values()]
      .sort((a, b) => (b.clicks + b.views) - (a.clicks + a.views))
      .slice(0, 20);

    // Top categories
    const categoryMap = new Map<string, number>();
    for (const e of [...productClicks, ...productViews]) {
      if (e.product_category) {
        categoryMap.set(e.product_category, (categoryMap.get(e.product_category) || 0) + 1);
      }
    }
    const topCategories = [...categoryMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // Top brands
    const brandMap = new Map<string, number>();
    for (const e of [...productClicks, ...productViews]) {
      if (e.product_brand) {
        brandMap.set(e.product_brand, (brandMap.get(e.product_brand) || 0) + 1);
      }
    }
    const topBrands = [...brandMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // Device breakdown
    const mobileCount = events.filter((e) => e.screen_width && e.screen_width < 768).length;
    const desktopCount = events.filter((e) => e.screen_width && e.screen_width >= 768).length;
    const deviceBreakdown = [
      { name: "Mobile", value: mobileCount },
      { name: "Desktop", value: desktopCount },
    ].filter((d) => d.value > 0);

    // Referrer breakdown
    const refMap = new Map<string, number>();
    for (const e of pageViews) {
      const ref = e.referrer ? new URL(e.referrer).hostname.replace("www.", "") : "Direto";
      refMap.set(ref, (refMap.get(ref) || 0) + 1);
    }
    const referrerBreakdown = [...refMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    return {
      totalEvents: events.length,
      uniqueVisitors,
      pageViews: pageViews.length,
      productClicks: productClicks.length,
      productViews: productViews.length,
      addToCarts: addToCarts.length,
      buyClicks: buyClicks.length,
      whatsappClicks: whatsappClicks.length,
      shareClicks: shareClicks.length,
      funnelData,
      topProducts,
      topCategories,
      topBrands,
      dailyVisitors,
      deviceBreakdown,
      referrerBreakdown,
    };
  }, [events]);

  // ── Search stats (keep existing) ─────────────────────
  const searchStats = useMemo(() => {
    if (!searches) return null;
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
    const zeroResultsTerms = [...termMap.entries()]
      .filter(([, data]) => data.zeroResults > 0)
      .sort((a, b) => b[1].zeroResults - a[1].zeroResults)
      .slice(0, 10)
      .map(([term, data]) => ({ term, count: data.zeroResults }));
    const dayMap = new Map<string, number>();
    for (const s of searches) {
      const day = new Date(s.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    }
    const dailyVolume = [...dayMap.entries()].map(([day, count]) => ({ day, count })).reverse();
    const uniqueUsers = new Set(searches.filter((s) => s.user_id).map((s) => s.user_id)).size;
    return { total: searches.length, uniqueTerms: termMap.size, uniqueUsers, zeroResultsCount: searches.filter((s) => s.results_count === 0).length, topTerms, zeroResultsTerms, dailyVolume };
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
            Analytics Completo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Funil de conversão, produtos mais clicados e buscas
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

      {/* Main KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Users size={13} />
              <span className="text-[11px] font-medium">Visitantes</span>
            </div>
            <p className="text-xl font-bold">{eventStats?.uniqueVisitors ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Eye size={13} />
              <span className="text-[11px] font-medium">Page Views</span>
            </div>
            <p className="text-xl font-bold">{eventStats?.pageViews ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <MousePointerClick size={13} />
              <span className="text-[11px] font-medium">Cliques Produto</span>
            </div>
            <p className="text-xl font-bold">{eventStats?.productClicks ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <ShoppingCart size={13} />
              <span className="text-[11px] font-medium">Add Carrinho</span>
            </div>
            <p className="text-xl font-bold">{eventStats?.addToCarts ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-green-600 mb-1">
              <MessageCircle size={13} />
              <span className="text-[11px] font-medium">WhatsApp</span>
            </div>
            <p className="text-xl font-bold text-green-700">{eventStats?.whatsappClicks ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-blue-600 mb-1">
              <Share2 size={13} />
              <span className="text-[11px] font-medium">Compartilhou</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{eventStats?.shareClicks ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-0 border-b">
        {([
          { key: "funnel" as const, label: "Funil & Tráfego", icon: TrendingUp },
          { key: "products" as const, label: "Produtos", icon: MousePointerClick },
          { key: "search" as const, label: "Buscas", icon: Search },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB: FUNIL & TRÁFEGO ═══ */}
      {tab === "funnel" && (
        <div className="space-y-4">
          {/* Conversion Funnel */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ArrowDown size={16} />
                Funil de Conversão (visitantes únicos)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(eventStats?.funnelData?.some((f) => f.value > 0)) ? (
                <div className="space-y-2">
                  {eventStats!.funnelData.map((step, i) => {
                    const prev = i > 0 ? eventStats!.funnelData[i - 1].value : step.value;
                    const rate = prev > 0 ? ((step.value / prev) * 100).toFixed(1) : "0";
                    const totalRate = eventStats!.funnelData[0].value > 0 ? ((step.value / eventStats!.funnelData[0].value) * 100).toFixed(1) : "0";
                    const maxVal = eventStats!.funnelData[0].value || 1;
                    return (
                      <div key={step.name} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-40 shrink-0 text-right">{step.name}</span>
                        <div className="flex-1 relative">
                          <div className="h-8 rounded-md bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-md transition-all duration-500 flex items-center px-3"
                              style={{
                                width: `${Math.max((step.value / maxVal) * 100, 3)}%`,
                                backgroundColor: step.fill,
                              }}
                            >
                              <span className="text-white text-xs font-bold whitespace-nowrap">
                                {step.value}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 w-24 text-right">
                          {i > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {rate}% <span className="text-[10px]">do anterior</span>
                            </span>
                          )}
                          {i > 0 && (
                            <p className="text-[10px] text-muted-foreground">{totalRate}% do total</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-10">
                  Nenhum evento registrado ainda. O funil aparecerá quando visitantes acessarem o site.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Daily Visitors Chart */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Visitantes por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                {(eventStats?.dailyVisitors?.length ?? 0) > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={eventStats!.dailyVisitors}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="visitors" name="Visitantes" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={2} />
                      <Area type="monotone" dataKey="events" name="Eventos" stroke="#F97316" fill="#F97316" fillOpacity={0.08} strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Sem dados.</p>
                )}
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Dispositivo</CardTitle>
              </CardHeader>
              <CardContent>
                {(eventStats?.deviceBreakdown?.length ?? 0) > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={eventStats!.deviceBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {eventStats!.deviceBreakdown.map((_, i) => (
                            <Cell key={i} fill={i === 0 ? "#8B5CF6" : "#3B82F6"} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Smartphone size={13} className="text-purple-500" /> Mobile
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Monitor size={13} className="text-blue-500" /> Desktop
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Sem dados.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Referrer */}
          {(eventStats?.referrerBreakdown?.length ?? 0) > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">De onde vieram os visitantes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={eventStats!.referrerBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="value" name="Visitas" fill="#6366F1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══ TAB: PRODUTOS ═══ */}
      {tab === "products" && (
        <div className="space-y-4">
          {/* Top Products Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MousePointerClick size={16} />
                Produtos Mais Clicados
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Ranking de produtos por interação (cliques + views + carrinho)
              </p>
            </CardHeader>
            <CardContent>
              {(eventStats?.topProducts?.length ?? 0) > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium text-muted-foreground text-xs">#</th>
                        <th className="pb-2 font-medium text-muted-foreground text-xs">Produto</th>
                        <th className="pb-2 font-medium text-muted-foreground text-xs">Marca</th>
                        <th className="pb-2 font-medium text-muted-foreground text-xs text-center">Cliques</th>
                        <th className="pb-2 font-medium text-muted-foreground text-xs text-center">Views</th>
                        <th className="pb-2 font-medium text-muted-foreground text-xs text-center">Carrinho</th>
                        <th className="pb-2 font-medium text-muted-foreground text-xs text-center">Conv. %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventStats!.topProducts.map((p, i) => {
                        const conv = p.clicks > 0 ? ((p.carts / p.clicks) * 100).toFixed(1) : "0";
                        return (
                          <tr key={p.name + i} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-2 text-xs font-bold text-muted-foreground">{i + 1}</td>
                            <td className="py-2 font-medium max-w-[200px] truncate">{p.name}</td>
                            <td className="py-2">
                              <Badge variant="secondary" className="text-[10px]">{p.brand}</Badge>
                            </td>
                            <td className="py-2 text-center">
                              <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                                <MousePointerClick size={12} /> {p.clicks}
                              </span>
                            </td>
                            <td className="py-2 text-center">
                              <span className="inline-flex items-center gap-1 text-purple-600">
                                <Eye size={12} /> {p.views}
                              </span>
                            </td>
                            <td className="py-2 text-center">
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                <ShoppingCart size={12} /> {p.carts}
                              </span>
                            </td>
                            <td className="py-2 text-center">
                              <Badge variant={Number(conv) > 10 ? "default" : "secondary"} className="text-[10px]">
                                {conv}%
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-10">
                  Nenhum clique em produto registrado ainda.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Categories & Brands */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Categorias Mais Acessadas</CardTitle>
              </CardHeader>
              <CardContent>
                {(eventStats?.topCategories?.length ?? 0) > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={eventStats!.topCategories} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 9 }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="value" name="Interações" fill="#22C55E" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Sem dados.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Marcas Mais Acessadas</CardTitle>
              </CardHeader>
              <CardContent>
                {(eventStats?.topBrands?.length ?? 0) > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={eventStats!.topBrands} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 9 }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="value" name="Interações" fill="#EC4899" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Sem dados.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ═══ TAB: BUSCAS ═══ */}
      {tab === "search" && (
        <div className="space-y-4">
          {/* Search KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Search size={14} />
                  <span className="text-xs font-medium">Total de Buscas</span>
                </div>
                <p className="text-2xl font-bold">{searchStats?.total ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp size={14} />
                  <span className="text-xs font-medium">Termos Únicos</span>
                </div>
                <p className="text-2xl font-bold">{searchStats?.uniqueTerms ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Eye size={14} />
                  <span className="text-xs font-medium">Usuários Buscando</span>
                </div>
                <p className="text-2xl font-bold">{searchStats?.uniqueUsers ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-500 mb-1">
                  <AlertCircle size={14} />
                  <span className="text-xs font-medium">Sem Resultado</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{searchStats?.zeroResultsCount ?? 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Search Volume */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Volume de Buscas por Dia</CardTitle>
            </CardHeader>
            <CardContent>
              {(searchStats?.dailyVolume?.length ?? 0) > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={searchStats!.dailyVolume}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="count" name="Buscas" stroke="#F97316" fill="#F97316" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-10">Nenhuma busca registrada.</p>
              )}
            </CardContent>
          </Card>

          {/* Top Terms & Zero Results */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp size={16} />
                  Termos Mais Buscados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(searchStats?.topTerms?.length ?? 0) > 0 ? (
                  <div className="space-y-2">
                    {searchStats!.topTerms.map((t, i) => (
                      <div key={t.term} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-5 text-right">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{t.term}</span>
                            {t.zeroResults > 0 && (
                              <Badge variant="destructive" className="text-[9px] px-1.5 py-0">{t.zeroResults}x sem resultado</Badge>
                            )}
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                            <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${(t.count / searchStats!.topTerms[0].count) * 100}%` }} />
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">{t.count}x</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">Nenhuma busca registrada.</p>
                )}
              </CardContent>
            </Card>

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
                {(searchStats?.zeroResultsTerms?.length ?? 0) > 0 ? (
                  <div className="space-y-2">
                    {searchStats!.zeroResultsTerms.map((t, i) => (
                      <div key={t.term} className="flex items-center justify-between gap-3 p-2.5 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-bold text-red-400 w-5 text-right shrink-0">{i + 1}</span>
                          <Search size={14} className="text-red-400 shrink-0" />
                          <span className="text-sm font-medium text-red-800 truncate">"{t.term}"</span>
                        </div>
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shrink-0">{t.count}x</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <AlertCircle size={32} className="mx-auto text-green-400 mb-2" />
                    <p className="text-sm text-muted-foreground">Todas as buscas retornaram resultados!</p>
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
                          <span className={s.results_count === 0 ? "text-red-600 font-semibold" : ""}>{s.results_count}</span>
                        </td>
                        <td className="py-2 text-muted-foreground text-xs">{new Date(s.created_at).toLocaleString("pt-BR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!searches || searches.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhuma busca registrada neste período.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
