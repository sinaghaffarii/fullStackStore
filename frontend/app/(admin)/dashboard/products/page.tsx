'use client';

import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import { ProductsTable } from '@/components/dashboard/products/ProductsTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useGetProductList } from '@/services/Products';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('newest');

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    [search],
  );

  const { data, isLoading } = useGetProductList({
    page,
    limit,
    search: debouncedSearch || undefined,
    sort,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
          <p className="text-sm text-muted-foreground">
            {data?.data.pagination.total || 0} محصول
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/add">
            <Plus className="ml-2 size-4" />
            افزودن محصول
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="w-2xs pr-10"
            value={search}
            dimension="lg"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در محصولات..."
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger size="lg" className="w-48">
            <SelectValue placeholder="مرتب‌سازی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">جدیدترین</SelectItem>
            <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
            <SelectItem value="price_low">ارزان‌ترین</SelectItem>
            <SelectItem value="price_high">گران‌ترین</SelectItem>
            <SelectItem value="best_selling">پرفروش‌ترین</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProductsTable
        data={data?.data.items || []}
        page={page}
        pageSize={limit}
        isLoading={isLoading}
        onPageChange={setPage}
        total={data?.data.pagination.total || 0}
      />
    </div>
  );
}
