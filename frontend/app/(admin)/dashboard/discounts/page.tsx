'use client';

import { Trash } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useGetDiscountList } from '@/services/Discount';
import { ROUTE_OBJECT } from '@/utils/constants';

import { DiscountHeader } from './+components/DiscountHeader';
import { DiscountTable } from './+components/DiscountTable';

const DEFAULT_LIMIT = 10;

function DiscountPage() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const initialPage = useMemo(
    () => parseInt(searchParams.get('page') ?? '1', 10),
    [searchParams],
  );

  const [page, setPage] = useState(initialPage);
  const [searchInput, setSearchInput] = useState('');

  const hasFilters =
    searchParams.has('is_active') || searchParams.has('validOnly');

  const params = useMemo(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('page', String(page));
    currentParams.set('limit', String(DEFAULT_LIMIT));
    return currentParams.toString();
  }, [page, searchParams]);

  useEffect(() => {
    if (
      searchParams.get('page') !== String(page) ||
      searchParams.get('limit') !== String(DEFAULT_LIMIT)
    ) {
      router.push(`${ROUTE_OBJECT.D_DISCOUNTS}?${params}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, router]);

  const isActive = searchParams.get('is_active') ?? undefined;
  const validOnly = searchParams.get('validOnly') ?? undefined;

  const { data, isLoading } = useGetDiscountList({
    page,
    limit: DEFAULT_LIMIT,
    isActive,
    validOnly,
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const handleCreate = () => {
    router.push(ROUTE_OBJECT.D_DISCOUNTS_Add);
  };
  const handleEdit = (discountId: string) => {
    router.push(`${ROUTE_OBJECT.D_DISCOUNTS_Edit}/${discountId}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleClearFilter = () => {
    const newParams = new URLSearchParams();
    newParams.set('page', String(page));
    newParams.set('limit', String(DEFAULT_LIMIT));
    router.replace(`${pathName}?${newParams.toString()}`);
  };

  return (
    <div className="space-y-6">
      <DiscountHeader
        searchValue={searchInput}
        onAddClick={handleCreate}
        onSearchChange={setSearchInput}
        total={pagination?.total ?? 0}
      />
      {hasFilters && (
        <Button
          variant="destructive"
          leftIcon={<Trash />}
          onClick={handleClearFilter}
        >
          حذف فیلترها
        </Button>
      )}

      <DiscountTable
        data={items}
        page={page}
        pageSize={DEFAULT_LIMIT}
        isLoading={isLoading}
        onEdit={handleEdit}
        onPageChange={handlePageChange}
        total={pagination?.total ?? 0}
      />
    </div>
  );
}

export default DiscountPage;
