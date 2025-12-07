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
    mutationFn: (title: string) =>
      fetch(`/api/categories/${title}`, { method: 'DELETE' }).then((res) =>
        res.json(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('دسته‌بندی با موفقیت حذف شد');
    },
    onError: () => {
      toast.error('خطا در حذف دسته‌بندی');
    },
  });

  const handleDelete = (title: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      deleteMutation.mutate(title);
    }
  };

  const columns: ColumnDef<CategoryData>[] = [
    {
      accessorKey: 'title',
      header: 'عنوان',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'توضیحات',
      cell: ({ row }) => (
        <span className="block max-w-md truncate">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: 'products',
      header: 'تعداد محصولات',
      cell: ({ row }) => <span>{row.original.products.length}</span>,
    },
    {
      accessorKey: 'filters',
      header: 'تعداد برندها',
      cell: ({ row }) => <span>{row.original.filters.brands.length}</span>,
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
              onClick={() => handleDelete(row.original.title)}
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
