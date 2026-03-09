import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Client { id: string; full_name: string; email: string; }

export default function WeeklyDigestButton({ clients }: { clients: Client[] }) {
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ whatsapp_message?: string; email_subject?: string; email_body?: string } | null>(null);
  const { toast } = useToast();

  async function generate() {
    if (!selectedClient) { toast({ title: "Selecione um cliente" }); return; }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-weekly-digest", {
        body: { client_id: selectedClient },
      });
      if (error) throw error;
      setResult(data);
      toast({ title: "Resumo gerado! ✨" });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado!" });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Mail size={14} className="text-primary" /> Resumo Semanal IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="flex-1 text-sm h-9">
              <SelectValue placeholder="Selecione um cliente..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.full_name} ({c.email})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={generate} disabled={loading || !selectedClient} className="gap-1 h-9">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Gerar
          </Button>
        </div>

        {result && (
          <div className="space-y-3">
            {result.whatsapp_message && (
              <div className="bg-muted rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">WhatsApp</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => copyToClipboard(result.whatsapp_message!)}>Copiar</Button>
                </div>
                <p className="text-xs whitespace-pre-wrap">{result.whatsapp_message}</p>
              </div>
            )}
            {result.email_body && (
              <div className="bg-muted rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Email: {result.email_subject}</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => copyToClipboard(result.email_body!)}>Copiar</Button>
                </div>
                <p className="text-xs whitespace-pre-wrap">{result.email_body}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
