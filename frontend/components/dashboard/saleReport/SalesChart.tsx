'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface Props {
  period: string;
  className?: string;
}

// داده‌های نمونه
const data = [
  { name: 'فروردین', revenue: 4200, orders: 120 },
  { name: 'اردیبهشت', revenue: 3800, orders: 98 },
  { name: 'خرداد', revenue: 5100, orders: 145 },
  { name: 'تیر', revenue: 4600, orders: 132 },
  { name: 'مرداد', revenue: 5400, orders: 156 },
  { name: 'شهریور', revenue: 6200, orders: 178 },
  { name: 'مهر', revenue: 5800, orders: 165 },
  { name: 'آبان', revenue: 7100, orders: 198 },
  { name: 'آذر', revenue: 6800, orders: 187 },
  { name: 'دی', revenue: 7500, orders: 210 },
  { name: 'بهمن', revenue: 8200, orders: 234 },
  { name: 'اسفند', revenue: 9100, orders: 256 },
];

export function SalesChart({ period, className }: Props) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">روند فروش</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenue" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid className="stroke-muted" strokeDasharray="3 3" />
              <XAxis
                axisLine={false}
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [
                  `${value.toLocaleString('fa-IR')} تومان`,
                  'درآمد',
                ]}
              />
              <Area
                dataKey="revenue"
                fill="url(#revenue)"
                type="monotone"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
