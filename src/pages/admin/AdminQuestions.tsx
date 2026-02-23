import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ProductQuestion, CatalogProduct } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  HelpCircle,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  User,
  Package,
} from "lucide-react";

type QuestionWithProduct = ProductQuestion & {
  catalog_products: { name: string; brand: string; image_url: string } | null;
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<QuestionWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "answered">("all");
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const { toast } = useToast();

  async function loadQuestions() {
    setLoading(true);
    const { data } = await supabase
      .from("product_questions")
      .select("*, catalog_products(name, brand, image_url)")
      .order("created_at", { ascending: false });
    setQuestions((data as QuestionWithProduct[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  const filtered = questions.filter((q) => {
    if (filter === "pending") return !q.answer;
    if (filter === "answered") return !!q.answer;
    return true;
  });

  const pendingCount = questions.filter((q) => !q.answer).length;
  const answeredCount = questions.filter((q) => !!q.answer).length;

  async function handleAnswer(questionId: string) {
    const text = answerText[questionId]?.trim();
    if (!text) return;

    setSubmitting(questionId);
    const { error } = await supabase
      .from("product_questions")
      .update({ answer: text, answered_at: new Date().toISOString() })
      .eq("id", questionId);
    setSubmitting(null);

    if (error) {
      toast({ title: "Erro ao responder", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Resposta enviada!" });
    setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
    loadQuestions();
  }

  async function handleDelete(questionId: string) {
    if (!confirm("Tem certeza que deseja excluir esta pergunta?")) return;

    const { error } = await supabase
      .from("product_questions")
      .delete()
      .eq("id", questionId);

    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Pergunta excluida" });
    loadQuestions();
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle size={24} className="text-blue-600" />
        <div>
          <h1 className="font-display text-xl font-bold">Perguntas e Respostas</h1>
          <p className="text-xs text-muted-foreground">
            Gerencie as perguntas dos clientes sobre os produtos
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white border rounded-xl p-3 text-center">
          <p className="text-2xl font-bold">{questions.length}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          <p className="text-[10px] text-amber-600">Pendentes</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
          <p className="text-[10px] text-green-600">Respondidas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {([
          { key: "all" as const, label: "Todas", count: questions.length },
          { key: "pending" as const, label: "Pendentes", count: pendingCount },
          { key: "answered" as const, label: "Respondidas", count: answeredCount },
        ]).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.key
                ? "bg-blue-600 text-white"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {f.label}
            <Badge variant="secondary" className={`text-[9px] ${filter === f.key ? "bg-white/20 text-white" : ""}`}>
              {f.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <HelpCircle size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            {filter === "pending" ? "Nenhuma pergunta pendente!" : "Nenhuma pergunta encontrada."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <div
              key={q.id}
              className={`bg-white border rounded-xl p-4 space-y-3 ${
                !q.answer ? "border-amber-200" : "border-border"
              }`}
            >
              {/* Product info */}
              {q.catalog_products && (
                <div className="flex items-center gap-2 pb-2 border-b">
                  <img
                    src={q.catalog_products.image_url}
                    alt={q.catalog_products.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{q.catalog_products.name}</p>
                    <p className="text-[10px] text-muted-foreground">{q.catalog_products.brand}</p>
                  </div>
                  {!q.answer ? (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[9px] gap-0.5">
                      <Clock size={9} />
                      Pendente
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-[9px] gap-0.5">
                      <CheckCircle2 size={9} />
                      Respondida
                    </Badge>
                  )}
                </div>
              )}

              {/* Question */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{q.asker_name}</span>
                    {q.asker_email && (
                      <span className="text-[10px] text-muted-foreground">{q.asker_email}</span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(q.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5">{q.question}</p>
                </div>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                  title="Excluir pergunta"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Answer or answer form */}
              {q.answer ? (
                <div className="flex items-start gap-2 ml-4 bg-green-50 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-green-700">Ju Imports</span>
                      {q.answered_at && (
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(q.answered_at).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-green-800 mt-0.5">{q.answer}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 ml-4">
                  <input
                    type="text"
                    placeholder="Escreva sua resposta..."
                    value={answerText[q.id] || ""}
                    onChange={(e) =>
                      setAnswerText((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && answerText[q.id]?.trim()) handleAnswer(q.id);
                    }}
                    className="flex-1 bg-muted/50 border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAnswer(q.id)}
                    disabled={submitting === q.id || !answerText[q.id]?.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                  >
                    {submitting === q.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    Responder
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
