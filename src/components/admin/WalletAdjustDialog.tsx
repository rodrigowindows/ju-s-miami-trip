import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAdjustWallet } from '@/hooks/useWallet';

interface WalletAdjustDialogProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

export default function WalletAdjustDialog({ open, onClose, clientId, clientName }: WalletAdjustDialogProps) {
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const adjust = useAdjustWallet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = type === 'credit' ? Math.abs(Number(amount)) : -Math.abs(Number(amount));
    adjust.mutate(
      { clientId, amount: value, description: reason },
      {
        onSuccess: () => {
          setAmount('');
          setReason('');
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar Wallet - {clientName}</DialogTitle>
          <DialogDescription className="sr-only">Adicionar crédito ou débito na wallet do cliente</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tipo</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as 'credit' | 'debit')} className="flex gap-4 mt-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="credit" id="wa-credit" />
                <Label htmlFor="wa-credit" className="font-normal text-emerald-600">Crédito (+)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="debit" id="wa-debit" />
                <Label htmlFor="wa-debit" className="font-normal text-red-600">Débito (-)</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="wa-amount">Valor (R$)</Label>
            <Input
              id="wa-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="wa-reason">Motivo</Label>
            <Input
              id="wa-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Cortesia, Correção, Reembolso..."
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={adjust.isPending}>
              {adjust.isPending ? 'Processando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
