import { useState } from "react";
import type { Promotion } from "@/types";
import { Button } from "@/components/ui/button";
import { usePromotions, useCreatePromotion, useUpdatePromotion, useTogglePromotion } from "@/hooks/usePromotions";
import PromotionCard from "@/components/admin/PromotionCard";
import PromotionForm from "@/components/admin/PromotionForm";
import { Loader2, Plus, Tag } from "lucide-react";

export default function AdminPromos() {
  const { data: promos = [], isLoading } = usePromotions();
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const togglePromotion = useTogglePromotion();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(promo: Promotion) {
    setEditing(promo);
    setFormOpen(true);
  }

  function handleToggle(id: string, active: boolean) {
    togglePromotion.mutate({ id, active });
  }

  function handleSubmit(values: Record<string, unknown>) {
    if (editing) {
      updatePromotion.mutate(
        { id: editing.id, ...values } as Partial<Promotion> & { id: string },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createPromotion.mutate(
        values as Omit<Promotion, "id" | "created_at" | "current_uses">,
        { onSuccess: () => setFormOpen(false) },
      );
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Promoções</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie cupons e promoções</p>
        </div>
        <Button onClick={openCreate} className="gap-2 w-full sm:w-auto">
          <Plus size={16} />
          Nova Promoção
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-20">
          <Tag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Nenhuma promoção cadastrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((promo) => (
            <PromotionCard
              key={promo.id}
              promotion={promo}
              onEdit={openEdit}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

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
