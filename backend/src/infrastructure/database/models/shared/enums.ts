export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum VariantType {
  COLOR = 'color',
  SIZE = 'size',
  MATERIAL = 'material',
  WEIGHT = 'weight',
  VOLUME = 'volume',
  CUSTOM = 'custom',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

// ==================== Filter & Sort Enums ====================
export enum DiscountScope {
  GLOBAL = 'global',
  CATEGORY = 'category',
  BRAND = 'brand',
  PRODUCT = 'product',
}

export enum SortOption {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PRICE_LOW = 'price_low',
  PRICE_HIGH = 'price_high',
  BEST_SELLING = 'best_selling',
  MOST_POPULAR = 'most_popular',
  HIGHEST_RATED = 'highest_rated',
}

export enum PriceRange {
  UNDER_100K = 'under_100k',
  RANGE_100K_500K = '100k_500k',
  RANGE_500K_1M = '500k_1m',
  RANGE_1M_5M = '1m_5m',
  OVER_5M = 'over_5m',
}

export const PRICE_RANGE_VALUES: Record<
  PriceRange,
  { min: number; max?: number }
> = {
  [PriceRange.UNDER_100K]: { min: 0, max: 1_000_000 },
  [PriceRange.RANGE_100K_500K]: { min: 1_000_000, max: 5_000_000 },
  [PriceRange.RANGE_500K_1M]: { min: 5_000_000, max: 10_000_000 },
  [PriceRange.RANGE_1M_5M]: { min: 10_000_000, max: 50_000_000 },
  [PriceRange.OVER_5M]: { min: 50_000_000 },
};

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'in_stock';
}
