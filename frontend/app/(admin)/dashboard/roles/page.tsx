'use client';

import { Plus, Search, Shield } from 'lucide-react';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import { Button } from '@/components/ui/Button';
import { BaseInput } from '@/components/ui/Input';
import { useGetAdminList } from '@/services/Admins';

import { AdminModal } from './+components/AdminModal';
import { AdminsTable } from './+components/AdminsTable';

export default function RolesPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page] = useState(1);
  const [limit] = useState(50);

  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    [search],
  );

  const { data, isLoading } = useGetAdminList({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const admins = data?.data?.items || [];
  const total = data?.data?.totalCount || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-500 shadow-lg">
            <Shield className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">مدیریت ادمین‌ها</h1>
            <p className="text-sm text-muted-foreground">{total} ادمین</p>
          </div>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="ml-2 size-4" />
          افزودن ادمین
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <BaseInput
          className="pr-10"
          value={search}
          dimension="lg"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در ادمین‌ها..."
        />
      </div>

      <AdminsTable data={admins} isLoading={isLoading} />

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
