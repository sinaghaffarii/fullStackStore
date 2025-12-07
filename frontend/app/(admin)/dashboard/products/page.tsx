'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ProductFilters } from '@/components/dashboard/products/ProductFilters';
import { ProductsTable } from '@/components/dashboard/products/ProductsTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ProductFilters {
  search: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean | null;
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 0,
    inStock: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, pageSize, filters],
    queryFn: () =>
      fetch(
        `/api/products?page=${page}&pageSize=${pageSize}&${new URLSearchParams(
          filters as any,
        )}`,
      ).then((res) => res.json()),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
          <p className="text-sm text-muted-foreground">
            {data?.total || 0} محصول
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/add">
            <Plus className="ml-2 size-4" />
            افزودن محصول
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pr-10 text-sm"
            value={filters.search}
            dimension="lg"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="جستجو در محصولات..."
          />
        </div>
        <ProductFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Table */}
      <ProductsTable
        data={data?.products || []}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageChange={setPage}
        total={data?.total || 0}
      />
    </div>
  );
}
