import type { Request } from 'express';

import rateLimit from 'express-rate-limit';

/* ==================== Global ==================== */
export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'درخواست‌های زیادی ارسال شده. لطفاً کمی صبر کنید.',
  },
});

/* ==================== Auth ==================== */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تلاش‌های زیادی انجام شده. لطفاً 15 دقیقه دیگر تلاش کنید.',
  },

  // ✅ custom key (avoid req.ip directly)
  keyGenerator: (req: Request) =>
    `auth:${req.body?.phoneNumber || req.body?.username || 'unknown'}`,
});

/* ==================== OTP ==================== */
export const otpRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      'تعداد درخواست کد تأیید بیش از حد مجاز. لطفاً یک ساعت دیگر تلاش کنید.',
  },
  keyGenerator: (req: Request) => `otp:${req.body?.phoneNumber || 'unknown'}`,
});

/* ==================== Admin Login ==================== */
export const adminLoginRateLimit = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تلاش‌های ناموفق زیاد. لطفاً 30 دقیقه دیگر تلاش کنید.',
  },
  keyGenerator: (req: Request) => `admin:${req.body?.username || 'unknown'}`,
});

/* ==================== Refresh Token ==================== */
export const refreshTokenRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'درخواست‌های زیادی برای تازه‌سازی توکن. لطفاً صبر کنید.',
  },
});

/* ==================== Password Reset ==================== */
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تعداد درخواست بازیابی رمز عبور بیش از حد مجاز.',
  },
  keyGenerator: (req: Request) =>
    `reset:${req.body?.email || req.body?.phoneNumber || 'unknown'}`,
});

/* ==================== API ==================== */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

/* ==================== Strict ==================== */
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تعداد عملیات بیش از حد مجاز. لطفاً صبر کنید.',
  },
});

/* ==================== Search ==================== */
export const searchRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تعداد جستجوها بیش از حد مجاز. لطفاً کمی صبر کنید.',
  },
});

/* ==================== Write ==================== */
export const writeRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تعداد عملیات بیش از حد مجاز. لطفاً کمی صبر کنید.',
  },
});
