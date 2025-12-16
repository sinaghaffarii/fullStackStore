'use client';

import { Filter, Grid3X3, Sparkles } from 'lucide-react';

import { Button } from '../ui/Button';
import { Select, SelectItem } from '../ui/Select';

interface CategoryHeaderProps {
  title: string;
  description: string;
  productCount: number;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  onOpenMobileFilters?: () => void;
}

const sortOptions = [
  { value: '0', label: 'پیش‌فرض' },
  { value: '1', label: 'ارزان‌ترین' },
  { value: '2', label: 'گران‌ترین' },
  { value: '3', label: 'پرفروش‌ترین' },
  { value: '4', label: 'محبوب‌ترین' },
  { value: '5', label: 'جدیدترین' },
] as const;

export function CategoryHeader({
  title,
  description,
  productCount,
  activeFilterCount = 0,
  onClearFilters,
  onOpenMobileFilters,
}: CategoryHeaderProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-lg border border-slate-700 bg-linear-to-r from-slate-900 to-indigo-900 p-6 shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 size-64 translate-x-32 -translate-y-32 rounded-full bg-linear-to-br from-purple-500 to-pink-500"></div>
        <div className="absolute bottom-0 left-0 size-48 -translate-x-24 translate-y-24 rounded-full bg-linear-to-tr from-cyan-500 to-blue-500"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500/20 p-2">
                <Grid3X3 className="size-5 text-indigo-300" />
              </div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
                {title}
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-sm font-medium text-indigo-100">
                  <Sparkles className="size-3" />
                  {productCount} محصول
                </span>
              </h1>
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-slate-300">
              {description}
            </p>

            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-1.5 text-sm text-slate-300">
                  <Filter className="size-4" />
                  <span>فیلترهای فعال: {activeFilterCount}</span>
                </div>
                <Button
                  className="rounded-lg bg-cyan-900/30 px-3 py-1.5 text-sm text-cyan-300 transition-colors hover:bg-cyan-900/50 hover:text-cyan-200"
                  type="button"
                  onClick={onClearFilters}
                >
                  حذف همه فیلترها
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <Select
                className="w-full border-slate-600 bg-white/10 text-white! transition-colors hover:bg-white/15 data-placeholder:text-white/70 sm:w-[200px]"
                placeholder="مرتب سازی"
              >
                {sortOptions.map((option) => (
                  <SelectItem
                    className="focus:bg-slate-700 focus:text-white"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* دکمه فیلتر برای موبایل */}
            <Button
              className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/25 lg:hidden"
              type="button"
              onClick={onOpenMobileFilters}
            >
              <Filter className="size-4" />
              فیلترها
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
