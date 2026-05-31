/* eslint-disable max-lines */
/* eslint-disable next/no-img-element */
'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { CheckCircle, Edit, MoreVertical, Trash2, XCircle } from 'lucide-react';
import Link from 'next/link';

import type { EnrichedProduct, ProductStatus } from '@/types/product';

import { confirmAction } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useDeleteProduct } from '@/services/Products';
import { formatPrice } from '@/utils/formatPrice';
import { topersianDate } from '@/utils/toPersianDate';

interface Props {
  data: EnrichedProduct[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface StockBadgeProps {
  status: ProductStatus;
}

const getStockBadge = ({ status }: StockBadgeProps) => {
  const upperCaseStatus = status.toUpperCase();
  const map: Record<
    string,
    {
      label: string;
      variant: 'default' | 'destructive' | 'success' | 'warning';
    }
  > = {
    IN_STOCK: { label: 'موجود', variant: 'success' },
    LOW_STOCK: { label: 'کم', variant: 'warning' },
    OUT_OF_STOCK: { label: 'ناموجود', variant: 'destructive' },
  };
  return map[upperCaseStatus];
};

function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const imageSrc = src
    ? `${process.env.NEXT_PUBLIC_API_URL_IMAGE}${src}`
    : '/images/products/defaultImage.jpg';

  return (
    <div className="relative size-16 overflow-hidden rounded-lg border">
      <img alt={alt} className="size-full object-cover" src={imageSrc} />
    </div>
  );
}

function ProductActions({
  product,
  onDelete,
}: {
  product: EnrichedProduct;
  onDelete: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="size-8" variant="ghost">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/products/${product.slug}/edit`}>
            <Edit className="ml-2 size-4" />
            ویرایش
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(product.id)}
        >
          <Trash2 className="ml-2 size-4" />
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProductsTable({
  data,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
}: Props) {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction({
      title: 'حذف محصول',
      text: 'آیا از حذف این محصول اطمینان دارید؟',
      confirmButtonText: 'حذف',
      cancelButtonText: 'انصراف',
    });
    if (confirmed) deleteProduct(id);
  };

  const columns: ColumnDef<EnrichedProduct>[] = [
    {
      accessorKey: 'primary_image',
      header: 'تصویر',
      cell: ({ row }) => (
        <ProductImage
          alt={row.original.name}
          src={row.original.primary_image}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'نام',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name ?? '--'}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.category?.name ?? '--'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'brand',
      header: 'برند',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.brand?.name_fa ?? '--'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'final_price',
      header: 'قیمت نهایی',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">
            {formatPrice(row.original.final_price)}
          </p>
          {row.original.discount_percent > 0 && (
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(row.original.base_price)}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'discount_percent',
      header: 'درصد تخفیف',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.discount_percent}</p>
        </div>
      ),
    },
    {
      accessorKey: 'stock_status',
      header: 'موجودی',
      cell: ({ row }) => {
        const badge = getStockBadge({
          status: row.original.stock_status as ProductStatus,
        });
        return <Badge variant={badge?.variant}>{badge?.label ?? '--'}</Badge>;
      },
    },
    {
      accessorKey: 'is_featured',
      header: 'ویژه',
      cell: ({ row }) =>
        row.original.is_featured ? (
          <CheckCircle className="size-5 text-green-500" />
        ) : (
          <XCircle className="size-5 text-muted-foreground" />
        ),
    },
    {
      accessorKey: 'created_at',
      header: 'تاریخ ایجاد',
      cell: ({ row }) => topersianDate(row.original.created_at),
    },
    {
      id: 'actions',
      header: 'عملیات',
      cell: ({ row }) => (
        <ProductActions onDelete={handleDelete} product={row.original} />
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      emptyMessage="محصولی یافت نشد"
      columns={columns}
      isLoading={isLoading || isPending}
      onPaginationChange={(updater: any) => {
        const newState =
          typeof updater === 'function'
            ? updater({ pageIndex: page - 1, pageSize })
            : updater;
        onPageChange(newState.pageIndex + 1);
      }}
      pagination={{ pageIndex: page - 1, pageSize }}
      totalCount={total}
    />
  );
}
