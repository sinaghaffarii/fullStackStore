/* eslint-disable max-lines */
'use client';

import type { ReadonlyURLSearchParams } from 'next/navigation';

import { BrushCleaning, Filter } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useImperativeHandle, useState } from 'react';

import type { CategoryData } from '@/src/types/product';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';

import { ProductFilters } from './ProductFilters';

interface ProductFiltersWrapperProps {
  filters: CategoryData['filters'];
  searchParams: ReadonlyURLSearchParams;
  onFilterCountChange?: (count: number) => void;
}

export interface ProductFiltersWrapperRef {
  openMobileDialog: () => void;
  resetFilters: () => void;
}

const DesktopSidebar = ({
  activeFilterCount,
  onReset,
  onApply,
  children,
}: {
  activeFilterCount: number;
  onReset: () => void;
  onApply: () => void;
  children: React.ReactNode;
}) => (
  <div className="hidden shrink-0 lg:block lg:w-72">
    <div className="sticky top-4 overflow-hidden rounded-lg border border-slate-100 bg-white p-5 shadow-xl">
      <div className="absolute top-0 right-0 size-20 translate-x-8 -translate-y-8 rounded-full bg-blue-500/5"></div>
      <div className="absolute bottom-0 left-0 size-16 -translate-x-8 translate-y-8 rounded-full bg-indigo-500/5"></div>

      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/10 p-2">
              <Filter className="size-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">فیلتر محصولات</h2>
          </div>

          <Tooltip title="پاک کردن همه فیلترها">
            <Button
              className="rounded-lg p-2 text-slate-500 transition-all duration-300 hover:bg-rose-50 hover:text-rose-500"
              type="button"
              variant="ghost"
              onClick={onReset}
            >
              <BrushCleaning className="size-5" />
            </Button>
          </Tooltip>
        </div>

        <div className="space-y-1">{children}</div>

        <div className="mt-6 flex gap-3 border-t border-slate-200 pt-4">
          <Button
            className="flex-1 rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 py-2.5 font-medium text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-indigo-500/25"
            type="button"
            onClick={onApply}
          >
            اعمال فیلتر
          </Button>
          <Button
            className="flex-1 rounded-lg border-slate-300 py-2.5 font-medium text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:text-slate-800"
            type="button"
            variant="outline"
            onClick={onReset}
          >
            بازنشانی
          </Button>
        </div>

        {activeFilterCount > 0 && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">فیلترهای فعال:</span>
              <span className="font-medium text-indigo-600">
                {activeFilterCount} مورد
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const MobileDialog = ({
  open,
  onOpenChange,
  onReset,
  onApply,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
  onApply: () => void;
  children: React.ReactNode;
}) => (
  <Dialog onOpenChange={onOpenChange} open={open}>
    <DialogContent className="max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Filter className="size-5" />
          فیلتر محصولات
        </DialogTitle>
      </DialogHeader>

      {children}

      <div className="mt-6 flex gap-3 border-t pt-4">
        <Button
          className="flex-1 bg-linear-to-r from-indigo-600 to-blue-600 text-white"
          type="button"
          onClick={onApply}
        >
          اعمال فیلتر
        </Button>
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={onReset}
        >
          بازنشانی
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export const ProductFiltersWrapper = ({
  ref,
  filters,
  searchParams,
  onFilterCountChange,
}: ProductFiltersWrapperProps & {
  ref?: React.RefObject<ProductFiltersWrapperRef | null>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false);

  const getActiveFilters = (): Record<string, string[]> => {
    const active: Record<string, string[]> = {};

    const brands = searchParams.getAll('brand');
    if (brands.length > 0) active.brand = brands;

    const prices = searchParams.getAll('price');
    if (prices.length > 0) active.price = prices;

    const features = searchParams.getAll('feature');
    if (features.length > 0) active.feature = features;

    return active;
  };

  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    () => getActiveFilters(),
  );

  const activeFilterCount = Object.values(activeFilters).flat().length;

  React.useEffect(() => {
    onFilterCountChange?.(activeFilterCount);
  }, [activeFilterCount, onFilterCountChange]);

  const updateURL = (newFilters: Record<string, string[]>) => {
    const params = new URLSearchParams();

    searchParams.forEach((value, key) => {
      if (!['brand', 'feature', 'price'].includes(key)) {
        params.append(key, value);
      }
    });

    Object.entries(newFilters).forEach(([key, values]) => {
      values.forEach((value) => params.append(key, value));
    });

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    });
  };

  const handleFilterChange = (filterName: string, values: string[]) => {
    const { [filterName]: _, ...rest } = activeFilters;
    const newFilters =
      values.length === 0 ? rest : { ...rest, [filterName]: values };
    setActiveFilters(newFilters);
  };

  const handleApply = () => {
    updateURL(activeFilters);
    setMobileDialogOpen(false);
  };

  const handleReset = () => {
    setActiveFilters({});
    updateURL({});
    setMobileDialogOpen(false);
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    openMobileDialog: () => setMobileDialogOpen(true),
    resetFilters: handleReset,
  }));

  const filtersComponent = (
    <ProductFilters
      activeFilters={activeFilters}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );

  return (
    <>
      <DesktopSidebar
        activeFilterCount={activeFilterCount}
        onApply={handleApply}
        onReset={handleReset}
      >
        {filtersComponent}
      </DesktopSidebar>

      <MobileDialog
        onApply={handleApply}
        onOpenChange={setMobileDialogOpen}
        onReset={handleReset}
        open={mobileDialogOpen}
      >
        {filtersComponent}
      </MobileDialog>
    </>
  );
};

ProductFiltersWrapper.displayName = 'ProductFiltersWrapper';
