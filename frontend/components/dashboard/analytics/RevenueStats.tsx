import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-primary/10 p-2">{icon}</div>
          <span
            className={cn(
              'text-xs font-medium',
              isPositive ? 'text-green-600' : 'text-red-600',
            )}
          >
            {isPositive ? '+' : ''}
            {change}%
          </span>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface Props {
  period: string;
}

export function RevenueStats({ period }: Props) {
  const stats = [
    {
      title: 'کل درآمد',
      value: '۱۲۴.۵M تومان',
      change: 12.5,
      icon: <DollarSign className="size-5 text-primary" />,
    },
    {
      title: 'تعداد سفارشات',
      value: '۱,۲۳۴',
      change: 8.2,
      icon: <ShoppingCart className="size-5 text-primary" />,
    },
    {
      title: 'محصولات فروخته شده',
      value: '۳,۴۵۶',
      change: -2.4,
      icon: <Package className="size-5 text-primary" />,
    },
    {
      title: 'مشتریان جدید',
      value: '۲۸۹',
      change: 18.7,
      icon: <Users className="size-5 text-primary" />,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
