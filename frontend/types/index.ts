import type { VariantOptionType } from './product';

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
  type: VariantOptionType;
  label: string;
  value: string;
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
