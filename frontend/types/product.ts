export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  base_price: number;
  image: string;
  images: string[];
  rating: string;
  reviews: number;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  stock?: number;
  brand: string;
  category: string;
  tags?: string[];
  specifications?: { label: string; value: string }[];
  created_at: string;
  updated_at: string;
}

export interface ProductDetail extends Product {
  brandFa?: string;
  colors?: ProductColor[];
  features?: string[];
  highlights?: string[];
}

export interface ProductColor {
  id: number;
  name: string;
  code: string;
  value: string;
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
