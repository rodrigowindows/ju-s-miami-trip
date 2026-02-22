import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';
import { CardSkeleton } from '@/components/shared/LoadingSkeleton';
import PromotionCard from '@/components/admin/PromotionCard';
import PromotionForm from '@/components/admin/PromotionForm';
import ReferralConfig from '@/components/admin/ReferralConfig';
import { usePromotions, useCreatePromotion, useUpdatePromotion, useTogglePromotion } from '@/hooks/usePromotions';
import type { Promotion } from '@/lib/types';

export default function AdminPromotions() {
  const { data: promotions, isLoading } = usePromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const togglePromotion = useTogglePromotion();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (p: Promotion) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const payload = {
      ...values,
      starts_at: new Date(values.starts_at as string).toISOString(),
      expires_at: new Date(values.expires_at as string).toISOString(),
      min_order_value: values.min_order_value ? Number(values.min_order_value) : null,
      max_uses: values.max_uses ? Number(values.max_uses) : null,
    };

    if (editing) {
      updatePromotion.mutate({ id: editing.id, ...payload } as Parameters<typeof updatePromotion.mutate>[0], {
        onSuccess: () => setFormOpen(false),
      });
    } else {
      createPromotion.mutate(payload as Parameters<typeof createPromotion.mutate>[0], {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleToggle = (id: string, active: boolean) => {
    togglePromotion.mutate({ id, active });
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Promoções' }]} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Promoções</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" /> Nova Promoção
        </Button>
      </div>

      <Tabs defaultValue="promotions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="promotions">Cupons & Promoções</TabsTrigger>
          <TabsTrigger value="referrals">Programa de Indicação</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : !promotions?.length ? (
            <EmptyState
              icon="promotions"
              title="Nenhuma promoção cadastrada"
              description="Crie sua primeira promoção para atrair mais clientes."
            >
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-1" /> Criar Promoção
              </Button>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promotions.map((p) => (
                <PromotionCard key={p.id} promotion={p} onEdit={handleEdit} onToggle={handleToggle} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="referrals">
          <ReferralConfig />
        </TabsContent>
      </Tabs>

      <PromotionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        promotion={editing}
        loading={createPromotion.isPending || updatePromotion.isPending}
      />
    </div>
  );
}
