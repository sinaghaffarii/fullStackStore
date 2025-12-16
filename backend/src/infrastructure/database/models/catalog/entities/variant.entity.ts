import type { VariantType } from '../../shared';

export interface VariantOption {
  type: VariantType;
  label: string;
  value: string;
}

export interface ProductVariantAttributes {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  options: VariantOption[];
  price: number;
  compare_price?: number;
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductVariantCreationAttributes
  extends Omit<
    ProductVariantAttributes,
    'created_at' | 'id' | 'is_active' | 'updated_at'
  > {
  is_active?: boolean;
}
