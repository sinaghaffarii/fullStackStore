'use client';

import { ScrollArea } from '@/components/ui/scrollArea';
import { CategoryData } from '@/src/types/product';

interface ProductFiltersProps {
  filters: CategoryData['filters'];
}

export function ProductFilters({ filters }: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {/* فیلتر برند */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="font-bold text-base mb-3 text-gray-800 flex items-center justify-between">
          <span>برند</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </h3>
        <ScrollArea className="space-y-2 max-h-48 overflow-y-auto ">
          {filters.brands.map((brand: string) => (
            <label
              key={brand}
              className="flex items-center justify-between cursor-pointer group py-1"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors ms-2">
                  {brand}
                </span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded me-1">
                {Math.floor(Math.random() * 50) + 1}
              </span>
            </label>
          ))}
        </ScrollArea>
      </div>

      {/* فیلتر محدوده قیمت */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="font-bold text-base mb-3 text-gray-800 flex items-center justify-between">
          <span>محدوده قیمت</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
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
                key={index}
                className="flex items-center space-x-2 space-x-reverse cursor-pointer group py-1"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors ms-2">
                  {range.label}
                </span>
              </label>
            ),
          )}
        </div>
      </div>

      {/* فیلتر ویژگی‌ها */}
      <div className="pb-4">
        <h3 className="font-bold text-base mb-3 text-gray-800 flex items-center justify-between">
          <span>ویژگی‌ها</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </h3>
        <div className="space-y-2">
          {filters.features.map((feature: string) => (
            <label
              key={feature}
              className="flex items-center space-x-2 space-x-reverse cursor-pointer group py-1"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors ms-2">
                {feature}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
