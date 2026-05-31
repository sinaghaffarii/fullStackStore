/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { CheckCircle, Edit, MoreVertical, Trash2, XCircle } from 'lucide-react';

import type { IDiscountType } from '@/types/discount';

import { confirmAction } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
  useDeleteDiscount,
  useToggleActiveDiscount,
} from '@/services/Discount';
import { DiscountTypeDisplay, DiscountTypeStatus } from '@/types/discount';
import { topersianDate } from '@/utils/toPersianDate';

interface Props {
  data: IDiscountType[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (discountId: string) => void;
}

export function DiscountTable({
  data,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
  onEdit,
}: Props) {
  const { mutate: deleteDiscount, isPending: deleteDiscountPending } =
    useDeleteDiscount();

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction({
      title: 'حذف تخفیف',
      text: 'آیا از حذف این تخفیف اطمینان دارید؟',
      confirmButtonText: 'حذف',
      cancelButtonText: 'انصراف',
    });
    if (confirmed) {
      deleteDiscount(id);
    }
  };

  const { mutate: toggleActiveMutate, isPending: toggleActivePending } =
    useToggleActiveDiscount();
  const changeActiveHandler = async (discountId: string) => {
    const confirmed = await confirmAction({
      title: 'تغییر وضعیت',
      text: 'آیا از تغییر وضعیت این تخفیف اطمینان دارید؟',
      confirmButtonText: 'بله',
      cancelButtonText: 'انصراف',
    });
    if (confirmed) toggleActiveMutate(discountId);
  };

  const columns: ColumnDef<IDiscountType>[] = [
    {
      accessorKey: 'name',
      header: 'نام تخفیف',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'coupon_code',
      header: 'کد تخفیف',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.original.coupon_code}</span>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'نوع تخفیف',
      cell: ({ row }) => {
        const discountType = row.original.type;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-medium">
              {DiscountTypeDisplay[discountType as DiscountTypeStatus] ||
                discountType}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: 'value',
      header: 'مقدار تخفیف',
      cell: ({ row }) => {
        const discountType = row.original.type;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center font-medium">
              <p className="text-base">{row.original.value}</p>
              {discountType === DiscountTypeStatus.PERCENTAGE ? (
                <p className="mx-2 text-xs">%</p>
              ) : (
                <p className="mx-2 text-xs">تومان</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'badge_text',
      header: 'متن نمایش',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.original.badge_text}</span>
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'وضعیت',
      cell: ({ row }) => (
        <div className="flex flex-col items-center justify-center gap-1">
          <Button
            size="icon"
            disabled={toggleActivePending}
            variant="secondary"
            loading={toggleActivePending}
            onClick={() => changeActiveHandler(row.original.id)}
          >
            {!toggleActivePending && (
              <span className="font-medium">
                {row.original.is_active ? (
                  <CheckCircle className="size-5 text-green-500" />
                ) : (
                  <XCircle className="size-5 text-red-500" />
                )}
              </span>
            )}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'starts_at',
      header: 'تاریخ و زمان',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <ul>
            <li className="mb-1 flex items-center justify-center gap-4 text-green-700">
              <p>تاریخ شروع</p>
              {topersianDate(row.original.starts_at ?? '')}
            </li>
            <li className="mb-1 flex items-center justify-center gap-4 text-red-700">
              <p>تاریخ پایان</p>
              {topersianDate(row.original.ends_at ?? '')}
            </li>
            <li className="mb-1 flex items-center justify-center gap-4">
              <p>تاریخ ایجاد</p>
              {topersianDate(row.original.createdAt ?? '')}
            </li>
          </ul>
        </div>
      ),
    },

    {
      id: 'actions',
      header: 'عملیات',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="size-8" variant="ghost">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                onEdit(row.original.id);
              }}
            >
              <Edit className="ml-2 size-4" />
              ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              variant="destructive"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="ml-2 size-4" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      emptyMessage="محصولی یافت نشد"
      columns={columns}
      isLoading={isLoading || deleteDiscountPending}
      onPaginationChange={(updaterOrValue: any) => {
        let newPageIndex = page - 1;

        if (typeof updaterOrValue === 'function') {
          const newState = updaterOrValue({
            pageIndex: page - 1,
            pageSize,
          });
          newPageIndex = newState.pageIndex;
        } else {
          newPageIndex = updaterOrValue.pageIndex;
        }

        onPageChange(newPageIndex + 1);
      }}
      pagination={{ pageIndex: page - 1, pageSize }}
      totalCount={total}
    />
  );
}
