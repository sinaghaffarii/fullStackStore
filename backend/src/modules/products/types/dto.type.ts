import type {
  ProductStatus,
  VariantType,
} from '../../../shared/types-enums/enums';

export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  category_id: string;
  brand_id?: string;
  tags?: string[];
  specifications?: Record<string, string>;
  is_featured?: boolean;
  is_new?: boolean;
  status?: ProductStatus;
  variants: {
    sku: string;
    name: string;
    options: { type: VariantType; label: string; value: string }[];
    price: number;
    compare_price?: number;
    stock: number;
    image_url?: string;
  }[];
  images: {
    url: string;
    alt?: string;
    sort_order?: number;
    is_primary?: boolean;
  }[];
}
