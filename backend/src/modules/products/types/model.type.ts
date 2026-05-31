import type { ProductStatus } from '../../../shared/types-enums/enums';

export interface ProductAttributes {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  category_id: string;
  brand_id?: string;
  tags: string[];
  specifications: Record<string, string>;
  view_count: number;
  sales_count: number;
  rating: number;
  review_count: number;
  status: ProductStatus;
  is_featured: boolean;
  is_new: boolean;
  created_at: Date;
  updated_at: Date;
}
