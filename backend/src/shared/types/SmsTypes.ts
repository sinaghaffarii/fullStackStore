export enum SmsResponseCode {
  Success = 1,
  InsufficientCredit = 2,
  DailyLimitExceeded = 3,
  VolumeLimitExceeded = 4,
  InvalidSenderNumber = 5,
  SystemUpdating = 6,
  FilteredWord = 7,
  PublicLineNotAllowed = 9,
  UserInactive = 10,
  NotSent = 11,
  IncompleteUserDocs = 12,
  ContainsLink = 14,
  MultipleRecipientsWithoutCancel = 15,
  RecipientNotFound = 16,
  EmptyMessage = 17,
  InvalidRecipientNumber = 18,
  WrongCredentials = 0,
  ApiKeyRequired = -110,
  AllowedIpRequired = -109,
  IpBlocked = -108,
}

export const SmsResponseMessages: Record<number, string> = {
  [SmsResponseCode.Success]: 'پیامک با موفقیت ارسال شد',
  [SmsResponseCode.InsufficientCredit]: 'اعتبار کافی نمی‌باشد',
  [SmsResponseCode.DailyLimitExceeded]: 'محدودیت در ارسال روزانه',
  [SmsResponseCode.VolumeLimitExceeded]: 'محدودیت در حجم ارسال',
  [SmsResponseCode.InvalidSenderNumber]: 'شماره فرستنده معتبر نمی‌باشد',
  [SmsResponseCode.SystemUpdating]: 'سامانه در حال بروزرسانی می‌باشد',
  [SmsResponseCode.FilteredWord]: 'متن حاوی کلمه فیلتر شده می‌باشد',
  [SmsResponseCode.PublicLineNotAllowed]:
    'ارسال از خطوط عمومی از طریق وب سرویس امکان‌پذیر نمی‌باشد',
  [SmsResponseCode.UserInactive]: 'کاربر مورد نظر فعال نمی‌باشد',
  [SmsResponseCode.NotSent]: 'ارسال نشده',
  [SmsResponseCode.IncompleteUserDocs]: 'مدارک کاربر کامل نمی‌باشد',
  [SmsResponseCode.ContainsLink]: 'متن حاوی لینک می‌باشد',
  [SmsResponseCode.MultipleRecipientsWithoutCancel]:
    'ارسال به بیش از 1 شماره بدون درج "لغو11" ممکن نیست',
  [SmsResponseCode.RecipientNotFound]: 'شماره گیرنده‌ای یافت نشد',
  [SmsResponseCode.EmptyMessage]: 'متن پیامک خالی می‌باشد',
  [SmsResponseCode.InvalidRecipientNumber]: 'شماره گیرنده نامعتبر است',
  [SmsResponseCode.WrongCredentials]: 'نام کاربری یا رمز عبور اشتباه می‌باشد',
  [SmsResponseCode.ApiKeyRequired]: 'الزام استفاده از ApiKey به جای رمز عبور',
  [SmsResponseCode.AllowedIpRequired]:
    'الزام تنظیم IP مجاز برای استفاده از API',
  [SmsResponseCode.IpBlocked]:
    'مسدود شدن IP به دلیل تلاش ناموفق استفاده از API',
};
