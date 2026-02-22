import { Percent, DollarSign, Calendar, Users, Pencil, Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';
import type { Promotion } from '@/types';
import { formatBRL, formatDate } from '@/lib/format';

interface PromotionCardProps {
  promotion: Promotion;
  onEdit: (p: Promotion) => void;
  onToggle: (id: string, active: boolean) => void;
}

export default function PromotionCard({ promotion, onEdit, onToggle }: PromotionCardProps) {
  const isExpired = new Date(promotion.expires_at) < new Date();
  const status = !promotion.active ? 'inactive' : isExpired ? 'expired' : 'active';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{promotion.name}</CardTitle>
            <code className="text-xs bg-muted px-2 py-0.5 rounded mt-1 inline-block font-mono">
              {promotion.coupon_code}
            </code>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          {promotion.discount_type === 'percent' ? (
            <Percent className="h-4 w-4 text-muted-foreground" />
          ) : (
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-semibold text-primary">
            {promotion.discount_type === 'percent'
              ? `${promotion.discount_value}% de desconto`
              : `${formatBRL(promotion.discount_value)} de desconto`}
          </span>
        </div>

        {promotion.min_order_value && (
          <p className="text-xs text-muted-foreground">
            Pedido minimo: {formatBRL(promotion.min_order_value)}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {formatDate(promotion.starts_at)} -{' '}
            {formatDate(promotion.expires_at)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>
            Usos: {promotion.current_uses}/{promotion.max_uses ?? '\u221E'}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(promotion)} className="flex-1">
            <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
          </Button>
          <Button
            variant={promotion.active ? 'destructive' : 'default'}
            size="sm"
            onClick={() => onToggle(promotion.id, !promotion.active)}
            className="flex-1"
          >
            <Power className="h-3.5 w-3.5 mr-1" />
            {promotion.active ? 'Desativar' : 'Ativar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
