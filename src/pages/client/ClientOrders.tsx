import EmptyState from '@/components/shared/EmptyState';

export default function ClientOrders() {
  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Meus Pedidos</h2>
      <EmptyState
        icon="orders"
        title="Nenhum pedido ainda"
        description="Quando você fizer seu primeiro pedido, ele aparecerá aqui."
      />
    </div>
  );
}
