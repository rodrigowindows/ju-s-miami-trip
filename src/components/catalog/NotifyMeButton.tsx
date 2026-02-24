import { useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  productId: string;
  productName: string;
  defaultEmail?: string | null;
}

export default function NotifyMeButton({ productId, productName, defaultEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function submit() {
    if (!email.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("product_alerts").insert({
      user_email: email.trim(),
      whatsapp: whatsapp.trim() || null,
      product_id: productId,
    });
    setSaving(false);

    if (error) {
      toast({ title: "Erro ao cadastrar alerta", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Tudo certo!", description: "Você será avisado quando este produto estiver disponível!" });
    setOpen(false);
  }

  return (
    <>
      <Button type="button" variant="outline" className="w-full gap-2" onClick={() => setOpen(true)}>
        <Bell size={16} />
        Avise-me quando chegar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avise-me quando chegar</DialogTitle>
            <DialogDescription>{productName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Seu e-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="WhatsApp (opcional)" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            <Button disabled={saving || !email.trim()} onClick={submit} className="w-full">
              {saving ? "Enviando..." : "Quero ser avisado"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
