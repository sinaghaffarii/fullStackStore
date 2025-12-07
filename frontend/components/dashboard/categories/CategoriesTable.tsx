'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

import type { CategoryData } from '@/types/product';

import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

interface Props {
  data: CategoryData[];
  isLoading: boolean;
}

export function CategoriesTable({ data, isLoading }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) =>
      fetch(`/api/categories/${id}`, { method: 'DELETE' }).then((res) => {
        if (!res.ok) throw new Error('خطا در حذف دسته‌بندی');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('دسته‌بندی با موفقیت حذف شد');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'خطا در حذف دسته‌بندی',
      );
    },
  });

  const handleDelete = (category: CategoryData) => {
    if (
      // eslint-disable-next-line no-alert
      window.confirm(`آیا از حذف دسته‌بندی «${category.title}» اطمینان دارید؟`)
    ) {
      // اگر API از ID پشتیبانی می‌کند، از id استفاده کنید
      // در غیر این صورت از title استفاده کنید
      deleteMutation.mutate(category.title);
    }
  };

  const columns: ColumnDef<CategoryData>[] = [
    {
      accessorKey: 'title',
      header: 'عنوان',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'توضیحات',
      cell: ({ row }) => (
        <div className="max-w-md truncate text-sm text-muted-foreground">
          {row.original.description || '—'}
        </div>
      ),
    },
    {
      id: 'products',
      header: 'تعداد محصولات',
      cell: ({ row }) => (
        <div className="text-center">{row.original.products.length}</div>
      ),
    },
    {
      id: 'brands',
      header: 'تعداد برندها',
      cell: ({ row }) => (
        <div className="text-center">{row.original.filters.brands.length}</div>
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
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/categories/${row.original.title}/edit`}>
                <Edit className="ml-2 size-4" />
                ویرایش
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => handleDelete(row.original)}
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
      emptyMessage="دسته‌بندی یافت نشد"
      columns={columns}
      isLoading={isLoading}
      totalCount={data.length}
    />
  );
}
