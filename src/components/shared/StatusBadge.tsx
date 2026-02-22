import { Badge } from '@/components/ui/badge';

const variants: Record<string, { label: string; className: string }> = {
  active: { label: 'Ativo', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  expired: { label: 'Expirado', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  inactive: { label: 'Inativo', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  pending: { label: 'Pendente', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  completed: { label: 'Concluído', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700 border-red-200' },
  processing: { label: 'Processando', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'Enviado', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  delivered: { label: 'Entregue', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  referral_credit: { label: 'Crédito Indicação', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  order_debit: { label: 'Uso em Pedido', className: 'bg-red-100 text-red-700 border-red-200' },
  admin_adjust: { label: 'Ajuste Admin', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  refund: { label: 'Reembolso', className: 'bg-amber-100 text-amber-700 border-amber-200' },
};

interface StatusBadgeProps {
  status: string;
  customLabel?: string;
}

export default function StatusBadge({ status, customLabel }: StatusBadgeProps) {
  const variant = variants[status] ?? { label: status, className: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <Badge variant="outline" className={variant.className}>
      {customLabel ?? variant.label}
    </Badge>
  );
}
