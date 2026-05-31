import z from 'zod';

export const checkoutSchema = z.object({
  shipping_address: z.string().min(1, 'آدرس الزامی است'),
  phone: z.string().min(1, 'شماره تلفن الزامی است'),
});
