'use client';

import { useState } from 'react';
import { useDebounce } from 'react-use';

import type { IBrand } from '@/types/brand';

import { useDialog } from '@/context/DialogContext';
import { useGetBrandList } from '@/services/Brand';

import { BrandDialog } from './+components/BrandDialog';
import { BrandHeader } from './+components/BrandHeader';
import { BrandsTable } from './+components/BrandsTable';

const DEFAULT_LIMIT = 10;

export default function BrandsPage() {
  const { isOpen, setOpen, open } = useDialog();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editingBrand, setEditingBrand] = useState<IBrand | undefined>();

  useDebounce(
    () => {
      setDebouncedSearch(searchInput);
      setPage(1);
    },
    500,
    [searchInput],
  );

  const { data, isLoading } = useGetBrandList({
    page,
    limit: DEFAULT_LIMIT,
    search: debouncedSearch || undefined,
  });

  const items = data?.data.items ?? [];
  const pagination = data?.data.pagination;

  const handleEdit = (brand: IBrand) => {
    setEditingBrand(brand);
    setOpen(true);
  };

  const handleCreate = () => {
    setEditingBrand(undefined);
    open();
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBrand(undefined);
  };

  return (
    <div className="space-y-6">
      <BrandHeader
        searchValue={searchInput}
        onAddClick={handleCreate}
        onSearchChange={setSearchInput}
        total={pagination?.total ?? 0}
      />

      <BrandsTable
        data={items}
        page={page}
        pageSize={DEFAULT_LIMIT}
        isLoading={isLoading}
        onEdit={handleEdit}
        onPageChange={setPage}
        total={pagination?.total ?? 0}
      />

      <BrandDialog brand={editingBrand} isOpen={isOpen} onClose={handleClose} />
    </div>
  );
}
