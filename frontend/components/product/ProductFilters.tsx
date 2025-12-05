/* eslint-disable max-lines */
'use client';

import type { CategoryData } from '@/types/product';

import { ScrollArea } from '@/components/ui/ScrollArea';

interface ProductFiltersProps {
  filters: CategoryData['filters'];
  activeFilters: Record<string, string[]>;
  onFilterChange: (filterName: string, values: string[]) => void;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div className="border-b border-gray-200 pb-4">
    <h3 className="mb-3 flex items-center justify-between text-base font-bold text-gray-800">
      <span>{title}</span>
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
    {children}
  </div>
);

interface CheckboxItemProps {
  label: string;
  value: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}

const CheckboxItem = ({
  label,
  value,
  isChecked,
  onChange,
  count,
}: CheckboxItemProps) => (
  <label className="group flex cursor-pointer items-center justify-between px-3 py-1">
    {count !== undefined && (
      <span className="me-1 rounded-sm bg-gray-100 px-2 py-1 text-xs text-gray-500">
        {count}
      </span>
    )}
    <div className="flex items-center space-x-2 space-x-reverse">
      <input
        checked={isChecked}
        className="size-4 cursor-pointer rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
        type="checkbox"
        value={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="ms-2 text-sm text-gray-700 transition-colors group-hover:text-blue-600">
        {label}
      </span>
    </div>
  </label>
);

const BrandFilter = ({
  brands,
  activeFilters,
  onFilterChange,
}: {
  brands: string[];
  activeFilters: string[];
  onFilterChange: (brand: string, checked: boolean) => void;
}) => (
  <FilterSection title="برند">
    <ScrollArea className="max-h-48 space-y-2 overflow-y-auto">
      {brands.map((brand) => (
        <CheckboxItem
          isChecked={activeFilters.includes(brand)}
          key={brand}
          label={brand}
          value={brand}
          count={24}
          onChange={(checked) => onFilterChange(brand, checked)}
        />
      ))}
    </ScrollArea>
  </FilterSection>
);

const PriceFilter = ({
  priceRanges,
  activeFilters,
  onFilterChange,
}: {
  priceRanges: { label: string; min: number; max: number }[];
  activeFilters: string[];
  onFilterChange: (range: string, checked: boolean) => void;
}) => (
  <FilterSection title="محدوده قیمت">
    <div className="space-y-2">
      {priceRanges.map((range) => {
        const rangeValue = `${range.min}-${range.max}`;
        return (
          <CheckboxItem
            isChecked={activeFilters.includes(rangeValue)}
            key={rangeValue}
            label={range.label}
            value={rangeValue}
            onChange={(checked) => onFilterChange(rangeValue, checked)}
          />
        );
      })}
    </div>
  </FilterSection>
);

const FeatureFilter = ({
  features,
  activeFilters,
  onFilterChange,
}: {
  features: string[];
  activeFilters: string[];
  onFilterChange: (feature: string, checked: boolean) => void;
}) => (
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
      {features.map((feature) => {
        const featureValue = feature
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace('دارای-', '');
        return (
          <CheckboxItem
            isChecked={activeFilters.includes(featureValue)}
            key={feature}
            label={feature}
            value={featureValue}
            onChange={(checked) => onFilterChange(featureValue, checked)}
          />
        );
      })}
    </div>
  </div>
);

export function ProductFilters({
  filters,
  activeFilters,
  onFilterChange,
}: ProductFiltersProps) {
  const handleCheckboxChange = (
    filterName: string,
    optionValue: string,
    isChecked: boolean,
  ) => {
    const currentValues = activeFilters[filterName] || [];
    const newValues = isChecked
      ? [...currentValues, optionValue]
      : currentValues.filter((v) => v !== optionValue);

    onFilterChange(filterName, newValues);
  };

  return (
    <div className="space-y-6">
      <BrandFilter
        activeFilters={activeFilters.brand || []}
        brands={filters.brands}
        onFilterChange={(brand, checked) =>
          handleCheckboxChange('brand', brand, checked)
        }
      />

      <PriceFilter
        activeFilters={activeFilters.price || []}
        priceRanges={filters.priceRanges}
        onFilterChange={(range, checked) =>
          handleCheckboxChange('price', range, checked)
        }
      />

      <FeatureFilter
        activeFilters={activeFilters.feature || []}
        features={filters.features}
        onFilterChange={(feature, checked) =>
          handleCheckboxChange('feature', feature, checked)
        }
      />
    </div>
  );
}
