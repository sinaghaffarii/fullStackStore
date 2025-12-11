import type { Request } from 'express';

import rateLimit from 'express-rate-limit';

// ==================== Global Rate Limit ====================
// برای همه درخواست‌ها - در app.ts استفاده میشه
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 100, // 100 درخواست در 15 دقیقه
  message: {
    success: false,
    message: 'درخواست‌های زیادی ارسال شده. لطفاً کمی صبر کنید.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
});

// ==================== Auth Rate Limit ====================
// برای verify-otp و عملیات احراز هویت
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 20, // 20 تلاش
  message: {
    success: false,
    message: 'تلاش‌های زیادی انجام شده. لطفاً 15 دقیقه دیگر تلاش کنید.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const identifier = req.body?.phoneNumber || req.body?.username || '';
    return `auth:${req.ip}:${identifier}`;
  },
});

// ==================== OTP Rate Limit ====================
// برای send-otp - محدودتر
export const otpRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ساعت
  max: 5, // فقط 5 OTP در ساعت
  message: {
    success: false,
    message:
      'تعداد درخواست کد تأیید بیش از حد مجاز. لطفاً یک ساعت دیگر تلاش کنید.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return `otp:${req.body?.phoneNumber || req.ip}`;
  },
});

// ==================== Admin Login Rate Limit ====================
// برای ورود ادمین - خیلی محدود
export const adminLoginRateLimit = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 دقیقه
  max: 5, // فقط 5 تلاش
  message: {
    success: false,
    message: 'تلاش‌های ناموفق زیاد. لطفاً 30 دقیقه دیگر تلاش کنید.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return `admin:${req.ip}:${req.body?.username || ''}`;
  },
});

// ==================== Refresh Token Rate Limit ====================
// برای refresh-token
export const refreshTokenRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 30, // 30 بار
  message: {
    success: false,
    message: 'درخواست‌های زیادی برای تازه‌سازی توکن. لطفاً صبر کنید.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== Password Reset Rate Limit ====================
// برای درخواست ریست پسورد
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ساعت
  max: 3, // فقط 3 بار در ساعت
  message: {
    success: false,
    message: 'تعداد درخواست بازیابی رمز عبور بیش از حد مجاز.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    return `reset:${req.body?.email || req.body?.phoneNumber || req.ip}`;
  },
});

// ==================== API Rate Limit ====================
// برای API های عمومی (محصولات، دسته‌بندی‌ها)
export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 دقیقه
  max: 60, // 60 درخواست در دقیقه
  message: {
    success: false,
    message: 'درخواست‌های زیادی ارسال شده. لطفاً کمی صبر کنید.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== Strict Rate Limit ====================
// برای عملیات حساس (حذف، ویرایش)
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 30, // 30 عملیات
  message: {
    success: false,
    message: 'تعداد عملیات بیش از حد مجاز. لطفاً صبر کنید.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// اضافه کن به انتهای فایل rate-limit.middleware.ts

// ==================== Search Rate Limit ====================
export const searchRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 دقیقه
  max: 30, // 30 جستجو در دقیقه
  message: {
    success: false,
    message: 'تعداد جستجوها بیش از حد مجاز. لطفاً کمی صبر کنید.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==================== Write Rate Limit ====================
export const writeRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 دقیقه
  max: 20, // 20 عملیات در دقیقه
  message: {
    success: false,
    message: 'تعداد عملیات بیش از حد مجاز. لطفاً کمی صبر کنید.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
