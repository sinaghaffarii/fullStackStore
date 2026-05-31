export enum DiscountTypeStatus {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export const DiscountTypeDisplay: Partial<Record<DiscountTypeStatus, string>> =
  {
    [DiscountTypeStatus.PERCENTAGE]: 'درصدی',
    [DiscountTypeStatus.FIXED]: 'ثابت',
  };

export interface IDiscountType {
  id: string;
  name: string; //نام تخفیف
  coupon_code: string; // کد تخفیف
  type: DiscountTypeStatus; // نوع تخفیف
  value: number | string; // مقدار تخفیف
  max_amount?: number | string; //"حداکثر مبلغ تخفیف (اختیاری)
  starts_at: string; //تاریخ شروع
  ends_at: string; //تاریخ پایان
  is_active: boolean; // فعال باشد
  badge_text?: string; //متن نشان
  createdAt?: string; //تاریخ ایجاد
  updatedAt?: string; // تاریخ به روزرسانی
}
