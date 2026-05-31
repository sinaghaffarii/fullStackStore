/* eslint-disable max-lines */
/* eslint-disable next/no-img-element */
/* eslint-disable max-lines-per-function */
'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { CheckCircle, Edit, MoreVertical, Trash2, XCircle } from 'lucide-react';

import type { IBrand } from '@/types/brand';

import { confirmAction } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useDeleteBrandItem } from '@/services/Brand';
import { topersianDate } from '@/utils/toPersianDate';

interface Props {
  data: IBrand[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (brand: IBrand) => void;
}

export function BrandsTable({
  data,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
  onEdit,
}: Props) {
  const { mutate: deleteBrand, isPending: deleteBrandPending } =
    useDeleteBrandItem();

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction({
      title: 'حذف برند',
      text: 'آیا از حذف این برند اطمینان دارید؟',
      confirmButtonText: 'حذف',
      cancelButtonText: 'انصراف',
    });
    if (confirmed) {
      deleteBrand(id);
    }
  };

  const columns: ColumnDef<IBrand>[] = [
    {
      accessorKey: 'logo',
      header: 'تصویر',
      cell: ({ row }) => {
        const imageSrc = row.original.logo
          ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${row.original.logo}`
          : '/images/products/defaultImage.jpg';
        return (
          <div className="relative size-12 overflow-hidden rounded-md border">
            <img
              alt={row.original.name}
              className="size-full object-cover p-1"
              src={imageSrc}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'نام محصول',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'name_fa',
      header: 'نام محصول به فارسی',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.original.name_fa}</span>
        </div>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'slug',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.original.slug}</span>
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'وضعیت',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            {row.original.is_active ? (
              <Button size="icon" variant="secondary">
                <CheckCircle className="size-5 text-green-500" />
              </Button>
            ) : (
              <Button size="icon" variant="secondary">
                <XCircle className="size-5 text-red-500" />
              </Button>
            )}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ ایجاد',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            {topersianDate(row.original.createdAt)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'تاریخ به روزرسانی',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            {topersianDate(row.original.updatedAt)}
          </span>
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
                onEdit(row.original);
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
      isLoading={isLoading || deleteBrandPending}
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
