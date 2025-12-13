/* eslint-disable @typescript-eslint/naming-convention */
// ==================== Product Enums ====================
export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum VariantType {
  COLOR = 'color',
  SIZE = 'size',
  VOLUME = 'volume',
  FLAVOR = 'flavor',
  NICOTINE = 'nicotine',
}

// ==================== Filter & Sort Enums ====================
export enum SortOption {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PRICE_LOW = 'price_low',
  PRICE_HIGH = 'price_high',
  BEST_SELLING = 'best_selling',
  MOST_POPULAR = 'most_popular',
}

export enum PriceRange {
  UNDER_100K = 'under_100k',
  UNDER_200K = 'under_200k',
  UNDER_500K = 'under_500k',
  UNDER_1M = 'under_1m',
  ABOVE_1M = 'above_1m',
}

export const PRICE_RANGE_VALUES: Record<
  PriceRange,
  { min: number; max: number | null }
> = {
  [PriceRange.UNDER_100K]: { min: 0, max: 100_000 },
  [PriceRange.UNDER_200K]: { min: 0, max: 200_000 },
  [PriceRange.UNDER_500K]: { min: 0, max: 500_000 },
  [PriceRange.UNDER_1M]: { min: 0, max: 1_000_000 },
  [PriceRange.ABOVE_1M]: { min: 1_000_000, max: null },
};

// ==================== Discount Enums ====================
export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum DiscountScope {
  PRODUCT = 'product',
  CATEGORY = 'category',
  BRAND = 'brand',
}

// ==================== Stock Status ====================
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export const getStockStatus = (
  quantity: number,
  threshold = 5,
): StockStatus => {
  if (quantity <= 0) return 'out-of-stock';
  if (quantity <= threshold) return 'low-stock';
  return 'in-stock';
};
