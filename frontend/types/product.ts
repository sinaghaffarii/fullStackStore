export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  stock: number;
  price?: number;
  is_active?: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  is_primary: boolean;
  sort_order?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  final_price: number;
  discount_percent: number;
  primary_image?: string;
  stock_status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  colors: { label: string; value: string }[];
  sizes: string[];
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; name_fa: string };
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_new: boolean;
  variants?: ProductVariant[];
  images?: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface CategoryData {
  type: 'category';
  title: string;
  description: string;
  products: Product[];
  filters: {
    brands: string[];
    priceRanges: { label: string; min: number; max: number }[];
    features: string[];
  };
}

export interface BreadcrumbSegment {
  title: string;
  href?: string;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
