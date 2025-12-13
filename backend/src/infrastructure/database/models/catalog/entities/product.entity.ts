import type { ProductStatus } from '../../shared';

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
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductCreationAttributes
  extends Omit<
    ProductAttributes,
    | 'created_at'
    | 'id'
    | 'is_featured'
    | 'is_new'
    | 'rating'
    | 'review_count'
    | 'sales_count'
    | 'specifications'
    | 'status'
    | 'tags'
    | 'updated_at'
    | 'view_count'
  > {
  tags?: string[];
  specifications?: Record<string, string>;
  status?: ProductStatus;
  is_featured?: boolean;
  is_new?: boolean;
}
