/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

import type { Product } from '@/types/product';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

interface Props {
  data: Product[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function ProductsTable({
  data,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
}: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/products/${id}`, { method: 'DELETE' }).then((res) =>
        res.json(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('محصول با موفقیت حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف محصول');
    },
  });

  const handleDelete = (id: number) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      deleteMutation.mutate(id);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'image',
      header: 'تصویر',
      cell: ({ row }) => (
        <div className="relative size-12 overflow-hidden rounded-md border">
          <Image
            fill
            alt={row.original.name}
            className="object-cover"
            src={row.original.image}
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
          <span className="text-xs text-muted-foreground">
            {row.original.slug}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'دسته‌بندی',
    },
    {
      accessorKey: 'brand',
      header: 'برند',
    },
    {
      accessorKey: 'price',
      header: 'قیمت',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            {row.original.price.toLocaleString()} تومان
          </span>
          {row.original.discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              {row.original.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'stock',
      header: 'موجودی',
      cell: ({ row }) => <span>{row.original.stock || 0} عدد</span>,
    },
    {
      id: 'status',
      header: 'وضعیت',
      cell: ({ row }) => {
        const { inStock, isNew, isBestseller } = row.original;
        return (
          <div className="flex flex-wrap gap-1">
            {inStock ? (
              <Badge className="bg-green-500 hover:bg-green-600">موجود</Badge>
            ) : (
              <Badge variant="destructive">ناموجود</Badge>
            )}
            {isNew && (
              <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                جدید
              </Badge>
            )}
            {isBestseller && (
              <Badge
                className="bg-amber-100 text-amber-800"
                variant="secondary"
              >
                پرفروش
              </Badge>
            )}
          </div>
        );
      },
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
      isLoading={isLoading}
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
