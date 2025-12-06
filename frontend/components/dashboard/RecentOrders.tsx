/* eslint-disable max-lines */
'use client';

import type { ColumnDef, PaginationState } from '@tanstack/react-table';

import { MoreVertical, Package } from 'lucide-react';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Progress } from '@/components/ui/Progress';
import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

import type { Order } from './data/index';

import {
  formatPrice,
  formatRelativeTime,
  orderStatusConfig,
  paymentStatusConfig,
  simulateApiCall,
} from './data/index';

// ============================================
// Columns Definition (جدا شده برای کاهش خطوط)
// ============================================

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNumber',
    header: 'شماره سفارش',
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-sm font-medium">
          {row.original.orderNumber}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(row.original.createdAt)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'customer',
    header: 'مشتری',
    cell: ({ row }) => {
      const { customer } = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-10 ring-2 ring-primary/10">
            <AvatarImage alt={customer.name} src={customer.avatar} />
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {customer.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{customer.name}</span>
            <span className="text-xs text-muted-foreground">
              {customer.phone}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'items',
    header: 'محصولات',
    cell: ({ row }) => {
      const { items, totalItems } = row.original;

      return (
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <div className="flex cursor-help items-center gap-2">
                <Package className="size-4 text-muted-foreground" />
                <span className="text-sm">{totalItems} محصول</span>
              </div>
            </TooltipTrigger>

            <TooltipContent side="bottom">
              <ul className="space-y-1 text-xs">
                {items.map((item) => (
                  <li className="flex justify-between gap-4" key={item.id}>
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">
                      ×{item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'مبلغ',
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {formatPrice(row.original.totalAmount)}
      </span>
    ),
  },
  {
    accessorKey: 'paymentStatus',
    header: 'پرداخت',
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      const config = paymentStatusConfig[status];
      return (
        <Badge
          className={cn('font-medium', config.className)}
          variant="secondary"
        >
          <span className="ml-1">{config.icon}</span>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'orderStatus',
    header: 'وضعیت',
    cell: ({ row }) => {
      const { orderStatus, progress } = row.original;
      const config = orderStatusConfig[orderStatus];

      return (
        <div className="flex min-w-[120px] flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{config.label}</span>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
          <Progress className="h-1.5" value={progress} />
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'عملیات',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="size-8" variant="ghost">
            <MoreVertical className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>مشاهده جزئیات</DropdownMenuItem>
          <DropdownMenuItem>ویرایش</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">حذف</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// ============================================
// Component
// ============================================

export default function RecentOrders() {
  const [data, setData] = React.useState<Order[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await simulateApiCall(
          pagination.pageIndex + 1,
          pagination.pageSize,
          500,
        );
        setData(response.data);
        setTotalCount(response.totalCount);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [pagination]);

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold">سفارشات اخیر</CardTitle>
        <Button size="sm" variant="ghost">
          مشاهده همه
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          data={data}
          emptyMessage="سفارشی یافت نشد"
          columns={columns}
          isLoading={isLoading}
          onPaginationChange={setPagination}
          pageSizeOptions={[10, 20, 50]}
          pagination={pagination}
          totalCount={totalCount}
        />
      </CardContent>
    </Card>
  );
}
