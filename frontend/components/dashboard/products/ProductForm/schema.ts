import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'نام محصول باید حداقل 2 کاراکتر باشد'),
  slug: z.string().min(2, 'نامک باید حداقل 2 کاراکتر باشد'),
  description: z.string().optional(),
  base_price: z.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
  category_id: z.string().min(1, 'دسته‌بندی الزامی است'),
  brand_id: z.string().optional(),
  is_featured: z.boolean(),
  is_new: z.boolean(),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1, 'SKU الزامی است'),
        name: z.string().min(1, 'نام الزامی است'),
        price: z.number().optional(),
        stock: z.number().min(0),
      }),
    )
    .min(1, 'حداقل یک واریانت الزامی است'),
  images: z
    .array(
      z.object({
        url: z.string().min(1, 'آدرس تصویر الزامی است'),
        alt: z.string().optional(),
        is_primary: z.boolean(),
      }),
    )
    .min(1, 'حداقل یک تصویر الزامی است'),
});

export type ProductFormData = z.infer<typeof productSchema>;
