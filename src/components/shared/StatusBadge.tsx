import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_CONFIG, PAYMENT_TYPE_CONFIG, WALLET_TYPE_CONFIG } from '@/lib/constants';

const allVariants: Record<string, { label: string; className: string }> = {};

// Merge order status
for (const [key, val] of Object.entries(ORDER_STATUS_CONFIG)) {
  allVariants[key] = { label: val.label, className: val.color };
}
// Merge payment types
for (const [key, val] of Object.entries(PAYMENT_TYPE_CONFIG)) {
  allVariants[key] = {
    label: val.label,
    className:
      val.variant === 'destructive'
        ? 'bg-red-100 text-red-700'
        : val.variant === 'default'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-700',
  };
}
// Merge wallet types
for (const [key, val] of Object.entries(WALLET_TYPE_CONFIG)) {
  allVariants[key] = { label: val.label, className: val.color };
}
// Extra generic statuses
Object.assign(allVariants, {
  active: { label: 'Ativo', className: 'bg-emerald-100 text-emerald-700' },
  expired: { label: 'Expirado', className: 'bg-gray-100 text-gray-600' },
  inactive: { label: 'Inativo', className: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Pendente', className: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Concluido', className: 'bg-emerald-100 text-emerald-700' },
});

const FALLBACK = { label: '', className: 'bg-gray-100 text-gray-600' };

interface StatusBadgeProps {
  status: string;
  customLabel?: string;
}

export default function StatusBadge({ status, customLabel }: StatusBadgeProps) {
  const variant = allVariants[status] ?? FALLBACK;
  return (
    <Badge variant="outline" className={variant.className}>
      {customLabel ?? (variant.label || status)}
    </Badge>
  );
}
