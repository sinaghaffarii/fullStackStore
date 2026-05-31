import z from 'zod';

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
