import { useState } from "react";
import { Bell, CheckCircle2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  productId: string;
  productName: string;
  defaultEmail?: string | null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function NotifyMeButton({ productId, productName, defaultEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();

  function validate() {
    if (!email.trim()) {
      setEmailError("E-mail é obrigatório.");
      return false;
    }
    if (!isValidEmail(email.trim())) {
      setEmailError("E-mail inválido.");
      return false;
    }
    setEmailError("");
    return true;
  }

  async function submit() {
    if (!validate()) return;
    setSaving(true);
    const { error } = await (supabase as any).from("product_alerts").insert({
      user_email: email.trim(),
      whatsapp: whatsapp.trim() || null,
      product_id: productId,
    });
    setSaving(false);

    if (error) {
      toast({ title: "Erro ao cadastrar alerta", description: error.message, variant: "destructive" });
      return;
    }

    setSuccess(true);
    toast({ title: "Tudo certo!", description: "Você será avisado quando este produto estiver disponível!" });
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) {
      setOpen(false);
      setTimeout(() => {
        setSuccess(false);
        setEmailError("");
      }, 300);
    } else {
      setOpen(true);
    }
  }

  return (
    <>
      <Button type="button" variant="outline" className="w-full gap-2 h-11 border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => setOpen(true)}>
        <Bell size={16} />
        Avise-me quando chegar
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Alerta cadastrado!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enviaremos uma notificação para <strong>{email}</strong> quando <strong>{productName}</strong> estiver disponível.
                </p>
              </div>
              <Button variant="outline" onClick={() => handleClose(false)} className="w-full">
                Fechar
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bell size={18} className="text-amber-500" />
                  Avise-me quando chegar
                </DialogTitle>
                <DialogDescription className="text-left">
                  Cadastre-se para receber um alerta quando <strong>{productName}</strong> estiver disponível novamente.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">E-mail *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="seu@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                      className={`pl-9 ${emailError ? "border-red-400" : ""}`}
                    />
                  </div>
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">WhatsApp (opcional)</label>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
                <Button disabled={saving} onClick={submit} className="w-full h-11">
                  {saving ? "Cadastrando..." : "Quero ser avisado"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
