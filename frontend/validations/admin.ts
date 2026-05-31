import z from 'zod';

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
