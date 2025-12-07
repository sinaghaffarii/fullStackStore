'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { CategoriesTable } from '@/components/dashboard/categories/CategoriesTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['categories', search],
    queryFn: () =>
      fetch(`/api/categories?search=${search}`).then((res) => res.json()),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-sm text-muted-foreground">
            {data?.length || 0} دسته‌بندی
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/categories/add">
            <Plus className="ml-2 size-4" />
            افزودن دسته‌بندی
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pr-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در دسته‌بندی‌ها..."
        />
      </div>

      {/* Table */}
      <CategoriesTable data={data || []} isLoading={isLoading} />
    </div>
  );
}
