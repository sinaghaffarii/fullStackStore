import { z } from 'zod';

export const AuthSchema = z.object({
  mobile: z
    .string()
    .nonempty('پر کردن این فیلد الزامی است')
    .regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
});

export const otpSchema = z.object({
  code: z.string().length(6, 'کد باید ۶ رقم باشد'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'نام محصول الزامی است'),
  description: z.string().optional(),
  base_price: z.number().min(0, 'قیمت باید مثبت باشد'),
  category_id: z.string().min(1, 'دسته‌بندی الزامی است'),
  stock_quantity: z.number().min(0, 'تعداد باید مثبت باشد'),
  is_active: z.boolean().default(true),
  attributes: z.record(z.string(), z.any()).default({}),
});

export const checkoutSchema = z.object({
  shipping_address: z.string().min(1, 'آدرس الزامی است'),
  phone: z.string().min(1, 'شماره تلفن الزامی است'),
});

export type LoginInput = z.infer<typeof AuthSchema>;
export type OTPInput = z.infer<typeof otpSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
