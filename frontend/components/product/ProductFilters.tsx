'use client';

import type { CategoryData } from '@/src/types/product';

import { ScrollArea } from '@/components/ui/scrollArea';

interface ProductFiltersProps {
  filters: CategoryData['filters'];
}

export function ProductFilters({ filters }: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {/* فیلتر برند */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="mb-3 flex items-center justify-between text-base font-bold text-gray-800">
          <span>برند</span>
          <svg
            className="size-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </h3>
        <ScrollArea className="max-h-48 space-y-2 overflow-y-auto">
          {filters.brands.map((brand: string) => (
            <label
              className="group flex cursor-pointer items-center justify-between py-1"
              key={brand}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  className="size-4 cursor-pointer rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                  type="checkbox"
                />
                <span className="ms-2 text-sm text-gray-700 transition-colors group-hover:text-blue-600">
                  {brand}
                </span>
              </div>
              <span className="me-1 rounded-sm bg-gray-100 px-2 py-1 text-xs text-gray-500">
                {/* {Math.floor(Math.random() * 50) + 1} */}
                24
              </span>
            </label>
          ))}
        </ScrollArea>
      </div>

      {/* فیلتر محدوده قیمت */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="mb-3 flex items-center justify-between text-base font-bold text-gray-800">
          <span>محدوده قیمت</span>
          <svg
            className="size-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </h3>
        <div className="space-y-2">
          {filters.priceRanges.map(
            (
              range: { label: string; min: number; max: number },
              index: number,
            ) => (
              <label
                className="group flex cursor-pointer items-center space-x-2 space-x-reverse py-1"
                key={index}
              >
                <input
                  className="size-4 cursor-pointer rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                  type="checkbox"
                />
                <span className="ms-2 text-sm text-gray-700 transition-colors group-hover:text-blue-600">
                  {range.label}
                </span>
              </label>
            ),
          )}
        </div>
      </div>

      {/* فیلتر ویژگی‌ها */}
      <div className="pb-4">
        <h3 className="mb-3 flex items-center justify-between text-base font-bold text-gray-800">
          <span>ویژگی‌ها</span>
          <svg
            className="size-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 9l-7 7-7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </h3>
        <div className="space-y-2">
          {filters.features.map((feature: string) => (
            <label
              className="group flex cursor-pointer items-center space-x-2 space-x-reverse py-1"
              key={feature}
            >
              <input
                className="size-4 cursor-pointer rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
                type="checkbox"
              />
              <span className="ms-2 text-sm text-gray-700 transition-colors group-hover:text-blue-600">
                {feature}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
