/* eslint-disable max-lines */
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { ROUTE_OBJECT } from './utils/constants';

// ============================================================================
// Constants
// ============================================================================

/** مسیرهای عمومی - همه دسترسی دارن */
const PUBLIC_PATHS = [
  ROUTE_OBJECT.HOME,
  ROUTE_OBJECT.PRODUCTS,
  ROUTE_OBJECT.CATEGORIES,
  ROUTE_OBJECT.ABOUT,
  ROUTE_OBJECT.CONTACT,
];

/** مسیرهای فقط مهمان - کاربران لاگین شده ریدایرکت میشن */
const GUEST_ONLY_PATHS = [ROUTE_OBJECT.ADMIN_LOGIN, ROUTE_OBJECT.USER_LOGIN];

/** مسیرهای فقط ادمین */
const ADMIN_ONLY_PATHS = [ROUTE_OBJECT.DASHBOARD];

/** مسیرهای نیازمند لاگین (هر نقشی) */
const AUTH_REQUIRED_PATHS = [
  ROUTE_OBJECT.PROFILE,
  ROUTE_OBJECT.ORDERS,
  ROUTE_OBJECT.CHECKOUT,
  ROUTE_OBJECT.CART,
];

/** کلید secret برای تایید امضا - باید با بک‌اند یکی باشه */
const COOKIE_SECRET =
  process.env.COOKIE_SECRET ||
  process.env.NEXT_PUBLIC_COOKIE_SECRET ||
  'your-secret-key';

const COOKIE_NAME = 'authState';
const SEPARATOR = '.';

// ============================================================================
// Types
// ============================================================================

type UserRole = 'admin' | 'customer';

interface AuthStatePayload {
  userId: string;
  role: UserRole;
  exp: number;
}

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: UserRole | null;
}

// ============================================================================
// Crypto Helper (Web Crypto API)
// ============================================================================

/**
 * ساخت امضای HMAC-SHA256 با Web Crypto API
 */
async function createSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(COOKIE_SECRET);
  const messageData = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);

  // تبدیل به base64url
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/[=]/g, '');
}

/**
 * تبدیل base64url به payload
 */
function decodePayload(encoded: string): AuthStatePayload | null {
  try {
    // تبدیل base64url به base64 استاندارد
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * تایید و خواندن کوکی امضا شده
 */
async function verifySignedAuthState(
  cookieValue: string,
): Promise<AuthStatePayload | null> {
  if (!cookieValue) return null;

  const parts = cookieValue.split(SEPARATOR);
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;

  // تایید امضا
  const expectedSignature = await createSignature(encodedPayload);
  if (signature !== expectedSignature) {
    return null; // امضا نامعتبر - دستکاری شده
  }

  // decode کردن payload
  const payload = decodePayload(encodedPayload);
  if (!payload) return null;

  // بررسی انقضا
  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null; // منقضی شده
  }

  return payload;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * بررسی مسیرهای استاتیک
 */
function isStaticPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  );
}

/**
 * بررسی تطابق مسیر
 */
function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * خواندن و تایید وضعیت احراز هویت از کوکی امضا شده
 */
async function getAuthState(request: NextRequest): Promise<AuthState> {
  const authStateCookie = request.cookies.get(COOKIE_NAME)?.value;

  if (!authStateCookie) {
    return { isAuthenticated: false, userId: null, role: null };
  }

  const payload = await verifySignedAuthState(authStateCookie);

  if (!payload) {
    return { isAuthenticated: false, userId: null, role: null };
  }

  return {
    isAuthenticated: true,
    userId: payload.userId,
    role: payload.role,
  };
}

/**
 * ریدایرکت ساده
 */
function redirect(request: NextRequest, path: string): NextResponse {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

/**
 * ریدایرکت با callback
 */
function redirectWithCallback(
  request: NextRequest,
  loginPath: string,
): NextResponse {
  const url = new URL(loginPath, request.url);
  url.searchParams.set('callbackUrl', request.nextUrl.pathname);
  const response = NextResponse.redirect(url);
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

// ============================================================================
// Route Handlers
// ============================================================================

/**
 * مسیرهای فقط مهمان
 */
function handleGuestOnlyPaths(
  request: NextRequest,
  auth: AuthState,
): NextResponse | null {
  if (!auth.isAuthenticated) return null;

  if (auth.role === 'admin') {
    return redirect(request, ROUTE_OBJECT.DASHBOARD);
  }
  return redirect(request, ROUTE_OBJECT.HOME);
}

/**
 * مسیرهای فقط ادمین
 */
function handleAdminOnlyPaths(
  request: NextRequest,
  auth: AuthState,
): NextResponse | null {
  if (!auth.isAuthenticated) {
    return redirectWithCallback(request, ROUTE_OBJECT.ADMIN_LOGIN);
  }

  if (auth.role !== 'admin') {
    return redirect(request, ROUTE_OBJECT.HOME);
  }

  return null;
}

/**
 * مسیرهای نیازمند لاگین
 */
function handleAuthRequiredPaths(
  request: NextRequest,
  auth: AuthState,
): NextResponse | null {
  if (!auth.isAuthenticated) {
    return redirectWithCallback(request, ROUTE_OBJECT.USER_LOGIN);
  }

  return null;
}

// ============================================================================
// Main Middleware
// ============================================================================

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. نادیده گرفتن مسیرهای استاتیک
  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  // 2. خواندن و تایید وضعیت احراز هویت
  const auth = await getAuthState(request);

  // 3. مسیرهای عمومی
  if (matchesPath(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  // 4. مسیرهای فقط مهمان
  if (matchesPath(pathname, GUEST_ONLY_PATHS)) {
    return handleGuestOnlyPaths(request, auth) ?? NextResponse.next();
  }

  // 5. مسیرهای فقط ادمین
  if (matchesPath(pathname, ADMIN_ONLY_PATHS)) {
    return handleAdminOnlyPaths(request, auth) ?? NextResponse.next();
  }

  // 6. مسیرهای نیازمند لاگین
  if (matchesPath(pathname, AUTH_REQUIRED_PATHS)) {
    return handleAuthRequiredPaths(request, auth) ?? NextResponse.next();
  }

  // 7. سایر مسیرها
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
