import { z } from 'zod';

import { ProductStatus, VariantOptionType } from '@/types/product';

export const productSchema = z.object({
  name: z.string().min(2, 'نام محصول باید حداقل ۲ کاراکتر باشد'),
  slug: z
    .string()
    .regex(/^[\s\-0-9a-z]+$/i, 'نامک فقط حروف انگلیسی، اعداد، فاصله و خط تیره')
    .min(3)
    .trim(),
  description: z.string().optional(),
  base_price: z
    .number({
      message: 'قیمت باید عدد باشد',
    })
    .min(0, 'قیمت نمی‌تواند منفی باشد')
    .optional()
    .refine((val) => val !== undefined, {
      message: 'قیمت پایه الزامی است',
    }),
  category_id: z.string().min(1, 'دسته‌بندی الزامی است'),
  brand_id: z.string().min(1, 'برند الزامی است'),
  tags: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).default({}), // تغییر برای Zod v4
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(true),
  status: z.nativeEnum(ProductStatus, {
    message: 'انتخاب وضعیت الزامی است',
  }),
  variants: z
    .array(
      z.object({
        name: z.string().min(1, 'نام واریانت الزامی است'),
        stock: z
          .number()
          .optional()
          .refine((val) => val !== undefined, { message: 'موجودی الزامی است' }),
        price: z
          .number()
          .optional()
          .refine((val) => val !== undefined, { message: 'قیمت الزامی است' }),
        compare_price: z.coerce.number().min(0).nullable().optional(),
        image_url: z.string().min(1, 'تصویر واریانت الزامی است'),
        options: z
          .array(
            z.object({
              type: z.nativeEnum(VariantOptionType),
              label: z.string().min(1, 'نام آپشن الزامی است'),
              value: z.string().min(1, 'مقدار آپشن الزامی است'),
            }),
          )
          .default([]),
      }),
    )
    .min(1, 'حداقل یک واریانت الزامی است'),
  images: z
    .array(
      z.object({
        url: z.string().min(1, 'آدرس تصویر الزامی است'),
        alt: z.string().optional(),
        is_primary: z.boolean().optional(),
      }),
    )
    .min(1, 'حداقل یک تصویر الزامی است'),
});
