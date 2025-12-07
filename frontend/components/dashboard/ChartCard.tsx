'use client';

import { MoreVertical } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  valueLabel?: string;
  children: React.ReactNode;
  className?: string;
  legend?: { label: string; color: string }[];
  action?: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  value,
  valueLabel,
  children,
  className,
  legend,
  action,
}: ChartCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {value && (
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-bold">{value}</span>
              {valueLabel && (
                <span className="text-sm text-muted-foreground">
                  {valueLabel}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="size-8" variant="ghost">
                <MoreVertical className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>دانلود گزارش</DropdownMenuItem>
              <DropdownMenuItem>به‌روزرسانی</DropdownMenuItem>
              <DropdownMenuItem>تنظیمات</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {children}
        {legend && legend.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-6 border-t pt-4">
            {legend.map((item, index) => (
              <div className="flex items-center gap-2" key={index}>
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
