import { z } from 'zod';

import { VariantOptionType } from '@/types/product';

export const variantOptionSchema = z.object({
  type: z.nativeEnum(VariantOptionType),
  label: z.string().min(1, 'نام آپشن الزامی است'),
  value: z.string().min(1, 'مقدار آپشن الزامی است'),
});

export const variantSchema = z.object({
  name: z.string().min(1, 'نام واریانت الزامی است'),
  stock: z.coerce.number().min(0, 'موجودی نمی‌تواند منفی باشد'),
  price: z.coerce.number().min(0).nullable(),
  compare_price: z.coerce.number().min(0).nullable(),
  image_url: z.string().nullable().optional(),
  options: z.array(variantOptionSchema).default([]),
});

export type VariantFormData = z.infer<typeof variantSchema>;
