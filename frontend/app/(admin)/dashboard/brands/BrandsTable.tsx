'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { Brand } from '@/types/brands';

import { confirmAction } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useDeleteBrand } from '@/services/products/Brands';

interface Props {
  data: Brand[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function BrandsTable({
  data,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
}: Props) {
  const { mutate: deleteBrand, isPending: deleteBrandPending } =
    useDeleteBrand();

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

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: 'image',
      header: 'تصویر',
      cell: ({ row }) => (
        <div className="relative size-12 overflow-hidden rounded-md border">
          <Image
            fill
            alt={row.original.name}
            className="object-cover"
            src={row.original.image ?? ''}
          />
        </div>
      ),
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
      accessorKey: 'description',
      header: 'توضیحات',
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
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/products/${row.original.id}/edit`}>
                <Edit className="ml-2 size-4" />
                ویرایش
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
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
