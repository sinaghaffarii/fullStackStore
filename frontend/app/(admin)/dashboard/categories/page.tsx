'use client';

import { GitBranch } from 'lucide-react';
import { useState } from 'react';

import type { ICategory } from '@/types/category';

import CategoryForm from '@/app/(admin)/dashboard/categories/+components/CategoryForm';
import { CategoriesTable } from '@/components/dashboard/categories/CategoriesTable';
import { CategoryTreePreview } from '@/components/dashboard/categories/CategoryTreePreview';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import {
  useGetCategoryHierarchy,
  useGetCategoryList,
} from '@/services/Category';

import { CategoryActions } from './+components/CategoryActions';
import { CategorySearch } from './+components/CategorySearch';

const DEFAULT_LIMIT = 20;

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTreeOpen, setIsTreeOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState<
    ICategory | undefined
  >();

  const { data, isLoading } = useGetCategoryList({
    page,
    limit: DEFAULT_LIMIT,
    includeChildren: false,
    search: debouncedSearch || undefined,
  });

  const { data: hierarchyData } = useGetCategoryHierarchy();

  const items = data?.data.items ?? [];
  const pagination = data?.data.pagination;
  const treeCategories = hierarchyData?.data ?? [];

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingCategory(undefined);
    setIsFormOpen(false);
  };

  const handleDebouncedSearch = (value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <CategoryForm
        isOpen={isFormOpen}
        category={editingCategory}
        onClose={handleCloseForm}
        treeCategories={treeCategories}
      />

      <Dialog onOpenChange={setIsTreeOpen} open={isTreeOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="size-5" />
              ساختار درختی دسته‌بندی‌ها
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            {treeCategories.length > 0 ? (
              <CategoryTreePreview categories={treeCategories} />
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                هنوز دسته‌بندی‌ای ایجاد نشده است
              </div>
            )}
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTreeOpen(false)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CategoryActions
        onAddCategory={() => setIsFormOpen(true)}
        onViewStructure={() => setIsTreeOpen(true)}
        totalCount={pagination?.total ?? 0}
      />

      <CategorySearch
        value={searchInput}
        onChange={setSearchInput}
        onDebouncedChange={handleDebouncedSearch}
      />

      <CategoriesTable
        data={items}
        page={page}
        pageSize={DEFAULT_LIMIT}
        isLoading={isLoading}
        onEdit={handleEdit}
        onPageChange={setPage}
        total={pagination?.total ?? 0}
      />
    </div>
  );
}
