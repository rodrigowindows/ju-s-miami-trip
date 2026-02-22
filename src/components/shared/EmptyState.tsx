import { Package, Plane, Users, Tag, Settings, Wallet } from 'lucide-react';

const icons = {
  orders: Package,
  trips: Plane,
  clients: Users,
  promotions: Tag,
  settings: Settings,
  wallet: Wallet,
} as const;

interface EmptyStateProps {
  icon?: keyof typeof icons;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function EmptyState({ icon = 'orders', title, description, children }: EmptyStateProps) {
  const Icon = icons[icon];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
