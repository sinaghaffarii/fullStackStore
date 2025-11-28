'use client';

import { CalendarDays, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function DateRangePicker() {
  return (
    <div className="flex items-center gap-3">
      {/* Date Range Display */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4" />
        <span>۷ آبان، ۱۴۰۴ - ۷ آذر، ۱۴۰۴</span>
      </div>

      {/* Order Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2" variant="outline">
            <CalendarDays className="size-4" />
            تاریخ سفارشی
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>امروز</DropdownMenuItem>
          <DropdownMenuItem>هفته گذشته</DropdownMenuItem>
          <DropdownMenuItem>ماه گذشته</DropdownMenuItem>
          <DropdownMenuItem>سال گذشته</DropdownMenuItem>
          <DropdownMenuItem>تاریخ سفارشی</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
