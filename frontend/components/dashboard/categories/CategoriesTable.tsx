'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { CheckCircle, Edit, MoreVertical, Trash2, XCircle } from 'lucide-react';

import type { ICategory } from '@/types/category';

import { confirmAction } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useDeleteCategoryItem } from '@/services/Category';
import { topersianDate } from '@/utils/toPersianDate';

interface Props {
  data: ICategory[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (category: ICategory) => void;
}

export function CategoriesTable({
  data,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
  onEdit,
}: Props) {
  const { mutate: deleteCategory, isPending: deletePending } =
    useDeleteCategoryItem();

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction({
      title: 'حذف دسته‌بندی',
      text: 'آیا از حذف این دسته‌بندی اطمینان دارید؟',
      confirmButtonText: 'حذف',
      cancelButtonText: 'انصراف',
    });
    if (confirmed) {
      deleteCategory(id);
    }
  };

  const columns: ColumnDef<ICategory>[] = [
    {
      accessorKey: 'image',
      header: 'تصویر',
      cell: ({ row }) => {
        const imageSrc = row.original.image
          ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${row.original.image}`
          : '/images/products/defaultImage.jpg';

        return (
          <div className="relative size-12 overflow-hidden rounded-md border">
            <img
              alt={row.original.name}
              className="size-full object-cover"
              src={imageSrc}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'عنوان',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'slug',
    },
    {
      accessorKey: 'is_active',
      header: 'وضعیت',
      cell: ({ row }) =>
        row.original.is_active ? (
          <Button size="icon" variant="secondary">
            <CheckCircle className="size-5 text-green-500" />
          </Button>
        ) : (
          <Button size="icon" variant="secondary">
            <XCircle className="size-5 text-red-500" />
          </Button>
        ),
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ ایجاد',
      cell: ({ row }) => topersianDate(row.original.createdAt),
    },
    {
      accessorKey: 'updatedAt',
      header: 'تاریخ بروزرسانی',
      cell: ({ row }) => topersianDate(row.original.updatedAt),
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
            <DropdownMenuItem onSelect={() => onEdit(row.original)}>
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
      emptyMessage="دسته‌بندی‌ای یافت نشد"
      columns={columns}
      isLoading={isLoading || deletePending}
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
