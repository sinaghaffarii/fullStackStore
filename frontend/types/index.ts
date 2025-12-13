/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines */
// ==================== Enums ====================
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

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum DiscountScope {
  PRODUCT = 'product',
  CATEGORY = 'category',
  BRAND = 'brand',
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

// ==================== Brand ====================
export interface Brand {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  logo?: string;
  is_active: boolean;
}

// ==================== Category ====================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  children?: Category[];
}

// برای منوی مگا
export interface MenuCategory {
  title: string;
  href?: string;
  children?: MenuCategory[];
}

// ==================== Product Variant ====================
export interface VariantOption {
  type: VariantType;
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  options: VariantOption[];
  price: number;
  compare_price?: number;
  stock: number;
  image_url?: string;
  is_active: boolean;
}

// ==================== Product Image ====================
export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sort_order: number;
  is_primary: boolean;
}

// ==================== Product ====================
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  final_price: number;
  discount_percent: number;
  primary_image?: string;
  stock_status: StockStatus;
  colors: ColorOption[];
  sizes: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand?: {
    id: string;
    name: string;
    name_fa: string;
  };
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_new: boolean;
}

export interface ColorOption {
  label: string;
  value: string; // hex code
}

// جزئیات کامل محصول
export interface ProductDetail extends Product {
  tags: string[];
  specifications: Record<string, string>;
  variants: ProductVariant[];
  images: ProductImage[];
  view_count: number;
  sales_count: number;
}

// ==================== Discount ====================
export interface Discount {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  max_amount?: number;
  scope: DiscountScope;
  target_id?: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  badge_text?: string;
}

// ==================== Cart ====================
export interface CartItem {
  id: string;
  variant_id: string;
  quantity: number;
  variant: {
    id: string;
    sku: string;
    name: string;
    price: number;
    image_url?: string;
    options: VariantOption[];
    product: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_items: number;
  total_price: number;
}

// ==================== Filters ====================
export interface ProductFilters {
  category_id?: string;
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  price_range?: PriceRange;
  in_stock?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  search?: string;
  tags?: string[];
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface AvailableFilters {
  brands: { id: string; name: string; name_fa: string; count: number }[];
  categories: { id: string; name: string; slug: string; count: number }[];
  price_range: { min: number; max: number };
  colors: { label: string; value: string; count: number }[];
  sizes: { name: string; count: number }[];
  tags: { name: string; count: number }[];
}

// ==================== API Responses ====================
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  filters?: AvailableFilters;
}

// ==================== Breadcrumb ====================
export interface BreadcrumbItem {
  title: string;
  href?: string;
}

// ==================== Price Helpers ====================
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

// ==================== Utility Types ====================
export interface CreateProductDTO {
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  category_id: string;
  brand_id?: string;
  tags?: string[];
  specifications?: Record<string, string>;
  status?: ProductStatus;
  is_featured?: boolean;
  is_new?: boolean;
  variants: Omit<ProductVariant, 'id' | 'is_active'>[];
  images: Omit<ProductImage, 'id'>[];
}

export type UpdateProductDTO = Partial<CreateProductDTO>;

export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CreateBrandDTO {
  name: string;
  name_fa: string;
  slug: string;
  logo?: string;
  is_active?: boolean;
}

export interface CreateDiscountDTO {
  name: string;
  type: DiscountType;
  value: number;
  max_amount?: number;
  scope: DiscountScope;
  target_id?: string;
  starts_at: string;
  ends_at: string;
  badge_text?: string;
  is_active?: boolean;
}

export interface AddToCartDTO {
  variant_id: string;
  quantity?: number;
}
