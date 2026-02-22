import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Promotion } from '@/integrations/supabase/types';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  coupon_code: z.string().min(1, 'Código é obrigatório'),
  discount_type: z.enum(['percent', 'fixed']),
  discount_value: z.number({ coerce: true }).positive('Valor deve ser positivo'),
  min_order_value: z.number({ coerce: true }).nullable().optional(),
  starts_at: z.string().min(1, 'Data início é obrigatória'),
  expires_at: z.string().min(1, 'Data fim é obrigatória'),
  max_uses: z.number({ coerce: true }).int().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PromotionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
  promotion?: Promotion | null;
  loading?: boolean;
}

export default function PromotionForm({ open, onClose, onSubmit, promotion, loading }: PromotionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: promotion
      ? {
          name: promotion.name,
          coupon_code: promotion.coupon_code,
          discount_type: promotion.discount_type,
          discount_value: promotion.discount_value,
          min_order_value: promotion.min_order_value,
          starts_at: promotion.starts_at?.slice(0, 16),
          expires_at: promotion.expires_at?.slice(0, 16),
          max_uses: promotion.max_uses,
        }
      : { discount_type: 'percent' },
  });

  const discountType = watch('discount_type');

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('coupon_code', e.target.value.toUpperCase());
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{promotion ? 'Editar Promoção' : 'Nova Promoção'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da campanha</Label>
            <Input id="name" {...register('name')} placeholder="Ex: Black Friday Miami" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="coupon_code">Código do cupom</Label>
            <Input
              id="coupon_code"
              {...register('coupon_code')}
              onChange={handleCouponChange}
              placeholder="EX: MIAMI2024"
              className="uppercase"
            />
            {errors.coupon_code && <p className="text-sm text-destructive mt-1">{errors.coupon_code.message}</p>}
          </div>

          <div>
            <Label>Tipo de desconto</Label>
            <RadioGroup
              defaultValue={promotion?.discount_type ?? 'percent'}
              onValueChange={(v) => setValue('discount_type', v as 'percent' | 'fixed')}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="percent" id="dt-percent" />
                <Label htmlFor="dt-percent" className="font-normal">Percentual (%)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="fixed" id="dt-fixed" />
                <Label htmlFor="dt-fixed" className="font-normal">Valor fixo (R$)</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="discount_value">
              Valor do desconto {discountType === 'percent' ? '(%)' : '(R$)'}
            </Label>
            <Input id="discount_value" type="number" step="0.01" {...register('discount_value')} />
            {errors.discount_value && <p className="text-sm text-destructive mt-1">{errors.discount_value.message}</p>}
          </div>

          <div>
            <Label htmlFor="min_order_value">Valor mínimo do pedido (R$)</Label>
            <Input id="min_order_value" type="number" step="0.01" {...register('min_order_value')} placeholder="Opcional" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="starts_at">Data início</Label>
              <Input id="starts_at" type="datetime-local" {...register('starts_at')} />
              {errors.starts_at && <p className="text-sm text-destructive mt-1">{errors.starts_at.message}</p>}
            </div>
            <div>
              <Label htmlFor="expires_at">Data fim</Label>
              <Input id="expires_at" type="datetime-local" {...register('expires_at')} />
              {errors.expires_at && <p className="text-sm text-destructive mt-1">{errors.expires_at.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="max_uses">Limite de usos</Label>
            <Input id="max_uses" type="number" {...register('max_uses')} placeholder="Sem limite" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Salvando...' : promotion ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
