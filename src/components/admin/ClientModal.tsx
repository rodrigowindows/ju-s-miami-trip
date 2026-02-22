import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, Phone, MapPin, Calendar, Users, Package } from 'lucide-react';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { useWalletTransactions } from '@/hooks/useWallet';
import { useMyReferrals } from '@/hooks/useReferrals';
import type { ClientWithStats } from '@/hooks/useClients';
import { format } from 'date-fns';

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  client: ClientWithStats | null;
  onAdjustWallet: () => void;
}

export default function ClientModal({ open, onClose, client, onAdjustWallet }: ClientModalProps) {
  const { data: transactions } = useWalletTransactions(client?.id ?? '');
  const { data: referrals } = useMyReferrals(client?.id ?? '');

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client.full_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Info */}
          <div className="space-y-2">
            {client.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {client.phone}
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {client.address}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Cliente desde {format(new Date(client.created_at), 'dd/MM/yyyy')}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-muted p-3 text-center">
              <Package className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
              <p className="text-lg font-bold">{client.total_orders}</p>
              <p className="text-xs text-muted-foreground">Pedidos</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <span className="text-lg font-bold">R$ {client.total_spent.toFixed(0)}</span>
              <p className="text-xs text-muted-foreground">Total gasto</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 text-center">
              <Wallet className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
              <p className="text-lg font-bold text-emerald-700">R$ {(client.wallet_balance ?? 0).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Saldo Wallet</p>
            </div>
          </div>

          <Button onClick={onAdjustWallet} variant="outline" className="w-full">
            <Wallet className="h-4 w-4 mr-2" />
            Ajustar Wallet
          </Button>

          {/* Referrals */}
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" /> Indicações ({referrals?.length ?? 0})
            </h4>
            {!referrals?.length ? (
              <p className="text-xs text-muted-foreground">Nenhuma indicação feita.</p>
            ) : (
              <div className="space-y-1.5">
                {referrals.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs bg-muted rounded px-2 py-1.5">
                    <span>{r.referral_code}</span>
                    <StatusBadge status={r.status} />
                    <span>R$ {r.credit_amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent wallet transactions */}
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Wallet className="h-4 w-4" /> Histórico Wallet
            </h4>
            {!transactions?.length ? (
              <p className="text-xs text-muted-foreground">Nenhuma transação.</p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {transactions.slice(0, 10).map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-xs bg-muted rounded px-2 py-1.5">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.type} />
                      <span className="text-muted-foreground">{t.description}</span>
                    </div>
                    <span className={`font-medium ${t.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.amount >= 0 ? '+' : ''}R$ {Math.abs(t.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
