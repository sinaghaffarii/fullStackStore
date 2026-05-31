'use client';

import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';

import { ProductsTable } from '@/app/(admin)/dashboard/products/+components/ProductsTable';
import { Button } from '@/components/ui/Button';
import { BaseInput } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { useGetProductList } from '@/services/Products';
import { SortOption } from '@/types/product';
import { ROUTE_OBJECT } from '@/utils/constants';

const DEFAULT_LIMIT = 10;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = useMemo(
    () => parseInt(searchParams.get('page') ?? '1', 10),
    [searchParams],
  );
  const [page, setPage] = useState(initialPage);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<SortOption>(SortOption.NEWEST);

  useDebounce(
    () => {
      setDebouncedSearch(searchInput);
    },
    500,
    [searchInput],
  );

  const params = useMemo(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('page', String(page));
    currentParams.set('limit', String(DEFAULT_LIMIT));
    currentParams.set('sort', sort);

    return currentParams.toString();
  }, [page, searchParams, sort]);

  useEffect(() => {
    if (
      searchParams.get('page') !== String(page) ||
      searchParams.get('limit') !== String(DEFAULT_LIMIT)
    ) {
      router.push(`${ROUTE_OBJECT.D_PRODUCTS}?${params}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, params]);

  const sortFilter = searchParams.get('sort') ?? undefined;

  const { data, isLoading } = useGetProductList({
    page,
    limit: DEFAULT_LIMIT,
    search: debouncedSearch || undefined,
    sort: sortFilter as SortOption,
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
          <BaseInput
            className="w-2xs pr-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="جستجو در محصولات..."
          />
        </div>

        <Select
          value={sort as string}
          onValueChange={(val) => setSort(val as SortOption)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="مرتب‌سازی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SortOption.NEWEST}>جدیدترین</SelectItem>
            <SelectItem value={SortOption.OLDEST}>قدیمی‌ترین</SelectItem>
            <SelectItem value={SortOption.PRICE_LOW}>ارزان‌ترین</SelectItem>
            <SelectItem value={SortOption.PRICE_HIGH}>گران‌ترین</SelectItem>
            <SelectItem value={SortOption.BEST_SELLING}>پرفروش‌ترین</SelectItem>
            <SelectItem value={SortOption.MOST_POPULAR}>محبوب ترین</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProductsTable
        data={data?.data.items || []}
        page={page}
        pageSize={DEFAULT_LIMIT}
        isLoading={isLoading}
        onPageChange={setPage}
        total={data?.data.pagination.total || 0}
      />
    </div>
  );
}
