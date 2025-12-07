'use client';

import { Calendar } from 'lucide-react';
import { useState } from 'react';

import { ExportButton } from '@/components/dashboard/analytics/ExportButton';
import { RevenueStats } from '@/components/dashboard/analytics/RevenueStats';
import { SalesChart } from '@/components/dashboard/analytics/SalesChart';
import { TopProducts } from '@/components/dashboard/analytics/TopProducts';
import { Select, SelectItem } from '@/components/ui/Select';

type Period = '1y' | '30d' | '7d' | '90d';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');

  return (
    <div
      className="space-y-6"
      id="analytics-report"
      style={{
        minHeight: '100px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">گزارشات فروش</h1>
          <p className="text-sm text-muted-foreground">
            تحلیل عملکرد فروش و درآمد
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            className="w-32"
            value={period}
            icon={<Calendar className="size-4" />}
            onValueChange={(v) => setPeriod(v as Period)}
          >
            <SelectItem value="7d">۷ روز</SelectItem>
            <SelectItem value="30d">۳۰ روز</SelectItem>
            <SelectItem value="90d">۹۰ روز</SelectItem>
            <SelectItem value="1y">یک سال</SelectItem>
          </Select>

          {/* Export Buttons */}
          <ExportButton />
        </div>
      </div>

      {/* Revenue Stats */}
      <RevenueStats period={period} />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SalesChart className="lg:col-span-2" period={period} />
        <TopProducts period={period} />
      </div>
    </div>
  );
}
