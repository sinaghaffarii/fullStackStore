import type {
  ProductStatus,
  StockStatus,
} from '../../../shared/types-enums/enums';
import type ProductVariant from '../models/product-variant.model';

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
  variants: ProductVariant[];
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
  created_at: Date;
  updated_at: Date;
}
