'use client';

import { useQuery } from '@tanstack/react-query';
import { Filter } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectItem } from '@/components/ui/Select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';

interface Props {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function ProductFilters({ filters, onFiltersChange }: Props) {
  const { data: filterOptions } = useQuery({
    queryKey: ['product-filters'],
    queryFn: () => fetch('/api/products/filters').then((res) => res.json()),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="ml-2 size-4" />
          فیلترها
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80" side="left">
        <SheetHeader>
          <SheetTitle>فیلتر محصولات</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <Label>دسته‌بندی</Label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, category: value })
              }
            >
              <SelectItem value="">همه دسته‌بندی‌ها</SelectItem>
              {filterOptions?.categories?.map((cat: string) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label>برند</Label>
            <Select
              value={filters.brand}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, brand: value })
              }
            >
              <SelectItem value="">همه برندها</SelectItem>
              {filterOptions?.brands?.map((brand: string) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>محدوده قیمت</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minPrice: Number(e.target.value),
                  })
                }
                placeholder="از"
              />
              <Input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    maxPrice: Number(e.target.value),
                  })
                }
                placeholder="تا"
              />
            </div>
          </div>

          {/* Stock Status */}
          <div className="space-y-2">
            <Label>وضعیت موجودی</Label>
            <Select
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  inStock: value === 'all' ? null : value === 'instock',
                })
              }
              value={
                filters.inStock === null
                  ? 'all'
                  : filters.inStock
                    ? 'instock'
                    : 'outofstock'
              }
            >
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="instock">موجود</SelectItem>
              <SelectItem value="outofstock">ناموجود</SelectItem>
            </Select>
          </div>

          {/* Reset */}
          <Button
            className="w-full"
            variant="outline"
            onClick={() =>
              onFiltersChange({
                search: '',
                category: '',
                brand: '',
                minPrice: 0,
                maxPrice: 0,
                inStock: null,
              })
            }
          >
            پاک کردن فیلترها
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
