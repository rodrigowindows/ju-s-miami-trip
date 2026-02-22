import { LogOut, Wallet, ArrowUpRight, ArrowDownRight, Phone, MapPin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletTransactions } from '@/hooks/useWallet';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ClientProfile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: transactions, isLoading } = useWalletTransactions(user?.id ?? '');

  const handleSignOut = async () => {
    await signOut();
    toast.success('Até logo!');
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold">Meu Perfil</h2>

      {/* Info */}
      <Card>
        <CardContent className="pt-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-miami-orange flex items-center justify-center text-white font-bold text-lg">
              {profile?.full_name.charAt(0) ?? '?'}
            </div>
            <div>
              <h3 className="font-semibold">{profile?.full_name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            {profile?.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> {profile.phone}
              </div>
            )}
            {profile?.address && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {profile.address}
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {user?.email}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
            Minha Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Balance highlight */}
          <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-5 text-center">
            <p className="text-sm opacity-90">Saldo disponível</p>
            <p className="text-4xl font-bold mt-1">R$ {(profile?.wallet_balance ?? 0).toFixed(2)}</p>
          </div>

          {/* Transaction history */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Histórico de transações</h4>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : !transactions?.length ? (
              <EmptyState
                icon="wallet"
                title="Nenhuma transação"
                description="Suas transações de créditos aparecerão aqui."
              />
            ) : (
              <div className="space-y-2">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`p-1.5 rounded-full ${t.amount >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {t.amount >= 0 ? (
                        <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={t.type} />
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{t.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${t.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.amount >= 0 ? '+' : ''}R$ {Math.abs(t.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(t.created_at), 'dd/MM')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button variant="outline" onClick={handleSignOut} className="w-full">
        <LogOut className="h-4 w-4 mr-2" />
        Sair da conta
      </Button>
    </div>
  );
}
