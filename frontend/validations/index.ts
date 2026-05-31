import type z from 'zod';

import type {
  adminLoginSchema,
  AuthSchema,
  otpSchema,
  registerSchema,
} from './auth';
import type { checkoutSchema } from './checkout';
import type { productSchema } from './product';

export type LoginInput = z.infer<typeof AuthSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OTPInput = z.infer<typeof otpSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ProductFormType = z.infer<typeof productSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
