'use client';

import { GitBranch, Plus } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface Props {
  onAddCategory: () => void;
  onViewStructure: () => void;
  totalCount: number;
}

export function CategoryActions({
  onAddCategory,
  onViewStructure,
  totalCount,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
        <p className="text-sm text-muted-foreground">{totalCount} دسته‌بندی</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onViewStructure}>
          <GitBranch className="ml-2 size-4" />
          نمایش ساختار
        </Button>
        <Button onClick={onAddCategory}>
          <Plus className="ml-2 size-4" />
          افزودن دسته‌بندی
        </Button>
      </div>
    </div>
  );
}
