import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import ClientModal from '@/components/admin/ClientModal';
import WalletAdjustDialog from '@/components/admin/WalletAdjustDialog';
import { useClients, type ClientWithStats } from '@/hooks/useClients';
import { format } from 'date-fns';

export default function AdminClients() {
  const [search, setSearch] = useState('');
  const { data: clients, isLoading } = useClients(search);

  const [selected, setSelected] = useState<ClientWithStats | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const handleRowClick = (c: ClientWithStats) => {
    setSelected(c);
    setModalOpen(true);
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Clientes' }]} />

      <h1 className="font-display text-2xl font-bold mb-6">Clientes</h1>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : !clients?.length ? (
        <EmptyState
          icon="clients"
          title="Nenhum cliente encontrado"
          description={search ? 'Tente outro termo de busca.' : 'Quando clientes se cadastrarem, aparecerão aqui.'}
        />
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                <TableHead className="text-center">Pedidos</TableHead>
                <TableHead className="text-right">Total gasto</TableHead>
                <TableHead className="text-right">Wallet</TableHead>
                <TableHead className="hidden md:table-cell">Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(c)}
                >
                  <TableCell className="font-medium">{c.full_name}</TableCell>
                  <TableCell className="text-sm">{c.phone || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                    {c.address || '-'}
                  </TableCell>
                  <TableCell className="text-center">{c.total_orders}</TableCell>
                  <TableCell className="text-right text-sm">R$ {c.total_spent.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-emerald-600">
                    R$ {(c.wallet_balance ?? 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {format(new Date(c.created_at), 'dd/MM/yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        client={selected}
        onAdjustWallet={() => {
          setModalOpen(false);
          setWalletOpen(true);
        }}
      />

      {selected && (
        <WalletAdjustDialog
          open={walletOpen}
          onClose={() => setWalletOpen(false)}
          clientId={selected.id}
          clientName={selected.full_name}
        />
      )}
    </div>
  );
}
