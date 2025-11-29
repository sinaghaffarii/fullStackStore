'use client';

import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingBag,
  ShoppingCart,
  Store,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/src/lib/utils';

// Map آیکون‌ها
const iconMap = {
  ShoppingCart,
  Package,
  Store,
  Users,
  DollarSign,
  ShoppingBag,
  Truck,
  BarChart3,
  TrendingUp,
} as const;

type IconName = keyof typeof iconMap;

interface StatsCardsProps {
  title: string;
  subtitle: string;
  value: string;
  iconName: IconName;
  trend: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'gradient';
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

export function StatsCards({
  title,
  subtitle,
  value,
  iconName,
  trend,
  variant = 'default',
  gradientFrom = 'from-primary/10',
  gradientTo = 'to-primary/5',
  className,
}: StatsCardsProps) {
  // دریافت کامپوننت آیکون از map
  const Icon = iconMap[iconName];

  return (
    <Card className={cn('card-hover border-border/50 bg-card', className)}>
      <CardContent className="space-y-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          </div>
          <div
            className={cn(
              'flex size-12 items-center justify-center rounded-xl shadow-md',
              variant === 'gradient'
                ? `bg-linear-to-br ${gradientFrom} ${gradientTo}`
                : 'bg-primary/10',
            )}
          >
            <Icon
              className={cn(
                'size-6',
                variant === 'gradient' ? 'text-primary' : 'text-primary',
              )}
            />
          </div>
        </div>

        {/* Subtitle & Trend */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive',
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
            {trend.value}%
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="relative h-16 overflow-hidden rounded-lg bg-muted/30">
          <div
            className={cn(
              'absolute inset-0 bg-linear-to-r opacity-30',
              gradientFrom,
              gradientTo,
            )}
          />
          {/* Simple wave effect */}
          <svg
            className="absolute inset-0 size-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 40"
          >
            <path
              d="M0 30 Q 25 10, 50 25 T 100 20 L 100 40 L 0 40 Z"
              fill="currentColor"
              className={cn(
                'opacity-20',
                trend.isPositive ? 'text-success' : 'text-destructive',
              )}
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
