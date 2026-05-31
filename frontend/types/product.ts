/* eslint-disable @typescript-eslint/naming-convention */

export interface ProductVariant {
  sku?: string;
  name: string;
  stock: number;
  price: number;
  options: { type: VariantOptionType; label: string; value: string }[];
  compare_price: number;
  image_url?: string;
}

export interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  is_primary: boolean;
  sort_order?: number;
}

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum VariantOptionType {
  COLOR = 'color',
  SIZE = 'size',
  MATERIAL = 'material',
  WEIGHT = 'weight',
  VOLUME = 'volume',
  CUSTOM = 'custom',
}

export interface CreateProductDto {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  category_id: string;
  brand_id?: string;
  tags?: string[];
  specifications?: Record<string, string>;
  is_featured: boolean;
  is_new: boolean;
  status: ProductStatus;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface EnrichedProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  final_price: number;
  discount_amount: number;
  discount_percent: number;
  price_display: {
    base: number;
    final: number;
    currency: string;
    discount_percent: number;
  };
  primary_image?: string;
  images: { url: string; alt?: string }[];
  stock_status: StockStatus;
  total_stock: number;
  colors: { label: string; value: string }[];
  sizes: string[];
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; name_fa: string; logo?: string };
  rating: number;
  review_count: number;
  sales_count: number;
  view_count: number;
  is_featured: boolean;
  is_new: boolean;
  status: ProductStatus;
  specifications: Record<string, string>;
  tags: string[];
  active_discount?: {
    id: string;
    name: string;
    type: string;
    value: number;
    badge_text?: string;
  };
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface CategoryData {
  type: 'category';
  title: string;
  description: string;
  products: CreateProductDto[];
  filters: {
    brands: string[];
    priceRanges: { label: string; min: number; max: number }[];
    features: string[];
  };
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

// ==================== Price Helpers ====================

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
export const PRICE_RANGE_LABELS: Record<PriceRange, string> = {
  [PriceRange.UNDER_100K]: 'زیر ۱۰۰ هزار',
  [PriceRange.UNDER_200K]: 'زیر ۲۰۰ هزار',
  [PriceRange.UNDER_500K]: 'زیر ۵۰۰ هزار',
  [PriceRange.UNDER_1M]: 'زیر ۱ میلیون',
  [PriceRange.ABOVE_1M]: 'بالای ۱ میلیون',
};

export const SORT_LABELS: Record<SortOption, string> = {
  [SortOption.NEWEST]: 'جدیدترین',
  [SortOption.OLDEST]: 'قدیمی‌ترین',
  [SortOption.PRICE_LOW]: 'ارزان‌ترین',
  [SortOption.PRICE_HIGH]: 'گران‌ترین',
  [SortOption.BEST_SELLING]: 'پرفروش‌ترین',
  [SortOption.MOST_POPULAR]: 'محبوب‌ترین',
};

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  'in-stock': 'موجود',
  'low-stock': 'تعداد محدود',
  'out-of-stock': 'ناموجود',
};
