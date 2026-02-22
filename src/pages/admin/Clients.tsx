import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, Wallet } from "lucide-react";

export default function Clients() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletOpen, setWalletOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Profile | null>(null);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletDescription, setWalletDescription] = useState("");

  async function fetchClients() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "cliente")
      .order("created_at", { ascending: false });
    setClients((data as Profile[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  function openWalletAdjust(client: Profile) {
    setSelectedClient(client);
    setWalletAmount("");
    setWalletDescription("");
    setWalletOpen(true);
  }

  async function handleWalletAdjust() {
    if (!selectedClient || !walletAmount) return;

    const amount = Number(walletAmount);
    const newBalance = (selectedClient.wallet_balance ?? 0) + amount;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ wallet_balance: newBalance })
      .eq("id", selectedClient.id);

    if (profileError) {
      toast({ title: "Erro", description: profileError.message, variant: "destructive" });
      return;
    }

    await supabase.from("wallet_transactions").insert({
      client_id: selectedClient.id,
      type: amount >= 0 ? "credit" : "debit",
      amount: Math.abs(amount),
      description: walletDescription || (amount >= 0 ? "Crédito manual" : "Débito manual"),
    });

    toast({ title: "Saldo atualizado!" });
    setWalletOpen(false);
    fetchClients();
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Clientes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie os clientes e seus saldos
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Nenhum cliente cadastrado.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Código Referral</TableHead>
                <TableHead className="text-right">Saldo Wallet</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-sm">
                    {client.full_name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">{client.email}</TableCell>
                  <TableCell className="text-sm">{client.phone ?? "—"}</TableCell>
                  <TableCell className="text-sm max-w-[150px] truncate">
                    {client.address ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm font-mono">
                    {client.referral_code ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium text-sm">
                    R$ {(client.wallet_balance ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => openWalletAdjust(client)}>
                      <Wallet size={14} />
                      Ajustar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Saldo Wallet</DialogTitle>
            <DialogDescription>
              Cliente: {selectedClient?.full_name ?? selectedClient?.email}
              <br />
              Saldo atual: R$ {(selectedClient?.wallet_balance ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Valor (positivo = crédito, negativo = débito)</Label>
              <Input
                type="number"
                step="0.01"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
                placeholder="Ex: 50.00 ou -25.00"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Input
                value={walletDescription}
                onChange={(e) => setWalletDescription(e.target.value)}
                placeholder="Motivo do ajuste..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWalletOpen(false)}>Cancelar</Button>
            <Button onClick={handleWalletAdjust} disabled={!walletAmount}>Aplicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
