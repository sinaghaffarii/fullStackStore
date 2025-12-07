import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

// ============================================================================
// Constants
// ============================================================================

const PUBLIC_PATHS = ['/', '/products', '/categories', '/about', '/contact'];
const CUSTOMER_AUTH_PATHS = ['/login', '/register'];
const ADMIN_AUTH_PATHS = ['/login'];
const ADMIN_ONLY_PATHS = ['/dashboard'];

// ============================================================================
// Helper Functions
// ============================================================================

function isStaticPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  );
}

function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function createRedirect(request: NextRequest, path: string): NextResponse {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

function createRedirectWithCallback(
  request: NextRequest,
  loginPath: string,
  callbackUrl: string,
): NextResponse {
  const url = new URL(loginPath, request.url);
  url.searchParams.set('callbackUrl', callbackUrl);
  const response = NextResponse.redirect(url);
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

// ============================================================================
// Route Handlers
// ============================================================================

function handleAdminAuthPaths(
  request: NextRequest,
  isAuth: boolean,
  userRole: string | undefined,
): NextResponse | null {
  if (isAuth && userRole === 'admin') {
    return createRedirect(request, '/dashboard');
  }
  if (isAuth && userRole === 'customer') {
    return createRedirect(request, '/');
  }
  return null;
}

function handleCustomerAuthPaths(
  request: NextRequest,
  isAuth: boolean,
  userRole: string | undefined,
): NextResponse | null {
  if (!isAuth) return null;

  if (userRole === 'admin') {
    return createRedirect(request, '/dashboard');
  }
  return createRedirect(request, '/');
}

// تغییرات اینجا انجام شد: pathname از ورودی حذف شد (تعداد پارامترها شد ۳)
function handleAdminOnlyPaths(
  request: NextRequest,
  isAuth: boolean,
  userRole: string | undefined,
): NextResponse | null {
  // pathname را از داخل request استخراج می‌کنیم
  const { pathname } = request.nextUrl;

  if (!isAuth) {
    return createRedirectWithCallback(request, '/login', pathname);
  }
  if (userRole !== 'admin') {
    return createRedirect(request, '/');
  }
  return null;
}

function handleProfilePaths(
  request: NextRequest,
  pathname: string,
  isAuth: boolean,
): NextResponse | null {
  if (!isAuth) {
    return createRedirectWithCallback(request, '/login', pathname);
  }
  return null;
}

// ============================================================================
// Main Middleware
// ============================================================================

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // نادیده گرفتن مسیرهای استاتیک
  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  const isAuth = request.cookies.get('isAuth')?.value === 'true';
  const userRole = request.cookies.get('userRole')?.value;

  // مسیرهای عمومی
  if (matchesPath(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  // صفحه لاگین ادمین
  if (matchesPath(pathname, ADMIN_AUTH_PATHS)) {
    return (
      handleAdminAuthPaths(request, isAuth, userRole) ?? NextResponse.next()
    );
  }

  // صفحات لاگین/ثبت‌نام مشتری
  if (matchesPath(pathname, CUSTOMER_AUTH_PATHS)) {
    return (
      handleCustomerAuthPaths(request, isAuth, userRole) ?? NextResponse.next()
    );
  }

  // مسیرهای داشبورد
  if (matchesPath(pathname, ADMIN_ONLY_PATHS)) {
    // تغییر در فراخوانی: دیگر pathname را پاس نمی‌دهیم
    return (
      handleAdminOnlyPaths(request, isAuth, userRole) ?? NextResponse.next()
    );
  }

  // صفحه پروفایل
  if (pathname.startsWith('/profile')) {
    return handleProfilePaths(request, pathname, isAuth) ?? NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
