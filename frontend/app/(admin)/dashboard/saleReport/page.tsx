'use client';

import { useState } from 'react';

import { ExportButton } from '@/components/dashboard/saleReport/ExportButton';
import { RevenueStats } from '@/components/dashboard/saleReport/RevenueStats';
import { SalesChart } from '@/components/dashboard/saleReport/SalesChart';
import { TopProducts } from '@/components/dashboard/saleReport/TopProducts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

type Period = '1y' | '30d' | '7d' | '90d';

export default function SaleReportPage() {
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
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">۷ روز</SelectItem>
              <SelectItem value="30d">۳۰ روز</SelectItem>
              <SelectItem value="90d">۹۰ روز</SelectItem>
              <SelectItem value="1y">یک سال</SelectItem>
            </SelectContent>
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
