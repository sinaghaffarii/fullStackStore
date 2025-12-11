// src/shared/utils/jwt.ts
import type { Response } from 'express';

import jwt from 'jsonwebtoken';

import { getAuthStateCookieName } from './signed-cookie';

// ============================================================================
// Constants
// ============================================================================

const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || 'access-secret-change-me';
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-me';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const isProduction = process.env.NODE_ENV === 'production';

// ============================================================================
// Base Cookie Options
// ============================================================================

const baseOptions = {
  secure: isProduction,
  sameSite: (isProduction ? 'strict' : 'lax') as 'lax' | 'strict',
  path: '/',
};

// ============================================================================
// Generate Tokens
// ============================================================================

export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'fullstack-store',
  });
}

export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'fullstack-store',
  });
}

// ============================================================================
// Verify Tokens
// ============================================================================

export function verifyAccessToken(token: string): object {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as object;
}

export function verifyRefreshToken(token: string): object {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as object;
}

// ============================================================================
// Set Cookies
// ============================================================================

/**
 * ست کردن کوکی Access Token (httpOnly)
 */
export function setAccessTokenCookie(res: Response, token: string): void {
  res.cookie('accessToken', token, {
    ...baseOptions,
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 دقیقه
  });
}

/**
 * ست کردن کوکی Refresh Token (httpOnly)
 */
export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie('refreshToken', token, {
    ...baseOptions,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
  });
}

/**
 * ست کردن کوکی امضا شده برای middleware فرانت‌اند
 * این کوکی httpOnly نیست تا middleware بتونه بخونه
 */
export function setAuthStateCookie(res: Response, signedValue: string): void {
  res.cookie(getAuthStateCookieName(), signedValue, {
    ...baseOptions,
    httpOnly: false, // قابل خواندن توسط middleware
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
  });
}

// ============================================================================
// Clear Cookies
// ============================================================================

/**
 * پاک کردن تمام کوکی‌های احراز هویت
 */
export function clearAuthCookies(res: Response): void {
  const clearOptions = {
    ...baseOptions,
    maxAge: 0,
  };

  // پاک کردن توکن‌های httpOnly
  res.cookie('accessToken', '', { ...clearOptions, httpOnly: true });
  res.cookie('refreshToken', '', { ...clearOptions, httpOnly: true });

  // پاک کردن کوکی امضا شده
  res.cookie(getAuthStateCookieName(), '', {
    ...clearOptions,
    httpOnly: false,
  });

  // پاک کردن کوکی‌های قدیمی (backward compatibility)
  // بعد از مدتی که مطمئن شدی کسی از نسخه قدیم استفاده نمیکنه، این دو خط رو حذف کن
  res.cookie('isAuth', '', clearOptions);
  res.cookie('userRole', '', clearOptions);
}
