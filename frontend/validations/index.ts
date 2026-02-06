import { z } from 'zod';

// ============================================================================
// Auth Schemas
// ============================================================================

export const AuthSchema = z.object({
  mobile: z
    .string()
    .nonempty('پر کردن این فیلد الزامی است')
    .regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
});

export const otpSchema = z.object({
  code: z.string().length(6, 'کد باید ۶ رقم باشد'),
});

export const registerSchema = z.object({
  mobile: z
    .string()
    .nonempty('پر کردن این فیلد الزامی است')
    .regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
});

export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(3, 'نام کاربری باید حداقل ۳ کاراکتر باشد')
    .nonempty('نام کاربری الزامی است'),
  password: z
    .string()
    .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد')
    .nonempty('رمز عبور الزامی است'),
  captchaToken: z.string().nonempty('تکمیل کپچا الزامی است'),
});

// ============================================================================
// Product Schema
// ============================================================================

export const productSchema = z.object({
  name: z.string().min(1, 'نام محصول الزامی است'),
  description: z.string().optional(),
  base_price: z.number().min(0, 'قیمت باید مثبت باشد'),
  category_id: z.string().min(1, 'دسته‌بندی الزامی است'),
  stock_quantity: z.number().min(0, 'تعداد باید مثبت باشد'),
  is_active: z.boolean().default(true),
  attributes: z.record(z.string(), z.any()).default({}),
});

// ============================================================================
// Checkout Schema
// ============================================================================

export const checkoutSchema = z.object({
  shipping_address: z.string().min(1, 'آدرس الزامی است'),
  phone: z.string().min(1, 'شماره تلفن الزامی است'),
});

// ============================================================================

export const createAdminSchema = z.object({
  username: z
    .string()
    .min(3, 'نام کاربری باید حداقل 3 کاراکتر باشد')
    .max(50, 'نام کاربری نمی‌تواند بیش از 50 کاراکتر باشد'),
  email: z.string().email('ایمیل نامعتبر است'),
  password: z
    .string()
    .min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!$%&*?@])/,
      'رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد',
    ),
});

export const updateAdminSchema = z.object({
  email: z.string().email('ایمیل نامعتبر است'),
});

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;
export type UpdateAdminFormData = z.infer<typeof updateAdminSchema>;

// ============================================================================
// Type Exports
// ============================================================================

export type LoginInput = z.infer<typeof AuthSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OTPInput = z.infer<typeof otpSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
