/* eslint-disable max-lines */
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { ROUTE_OBJECT } from './utils/constants';

// ============================================================================
// Route Groups
// ============================================================================

const PUBLIC_PATHS = [
  ROUTE_OBJECT.HOME,
  ROUTE_OBJECT.PRODUCTS,
  ROUTE_OBJECT.CATEGORIES,
  ROUTE_OBJECT.ABOUT,
  ROUTE_OBJECT.CONTACT,
];

const GUEST_ONLY_PATHS = [ROUTE_OBJECT.USER_LOGIN, ROUTE_OBJECT.ADMIN_LOGIN];

const AUTH_REQUIRED_PATHS = [
  ROUTE_OBJECT.PROFILE,
  ROUTE_OBJECT.ORDERS,
  ROUTE_OBJECT.CHECKOUT,
  ROUTE_OBJECT.CART,
];

const ADMIN_ONLY_PATHS = [ROUTE_OBJECT.DASHBOARD];
const SUPER_ADMIN_ONLY_PATHS = [ROUTE_OBJECT.D_ROLES];

// ============================================================================
// Auth / Cookie
// ============================================================================

const COOKIE_NAME = 'authState';
const COOKIE_SECRET =
  process.env.COOKIE_SECRET || process.env.NEXT_PUBLIC_COOKIE_SECRET;

const SEPARATOR = '.';

enum UserRole {
  Admin = 'admin',
  Customer = 'customer',
  SuperAdmin = 'super-admin',
}

interface AuthPayload {
  userId: string;
  role: UserRole;
  exp: number;
}

interface AuthState {
  authenticated: boolean;
  role: UserRole | null;
}

// ============================================================================
// Crypto Helpers
// ============================================================================

async function sign(data: string): Promise<string> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(COOKIE_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/[=]/g, '');
}

function decodePayload(encoded: string): AuthPayload | null {
  try {
    const json = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

async function verifyAuthCookie(cookie?: string): Promise<AuthPayload | null> {
  if (!cookie) return null;

  const [payload, signature] = cookie.split(SEPARATOR);
  if (!payload || !signature) return null;

  const expectedSignature = await sign(payload);
  if (signature !== expectedSignature) return null;

  const decoded = decodePayload(payload);
  if (!decoded) return null;

  if (decoded.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return decoded;
}

// ============================================================================
// Utils
// ============================================================================

function isStaticPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  );
}

function match(pathname: string, paths: string[]): boolean {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function redirect(request: NextRequest, to: string): NextResponse {
  const res = NextResponse.redirect(new URL(to, request.url));
  res.headers.set('x-middleware-cache', 'no-cache');
  return res;
}

function redirectWithCallback(
  request: NextRequest,
  loginPath: string,
): NextResponse {
  const url = new URL(loginPath, request.url);
  url.searchParams.set(
    'callbackUrl',
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return redirect(request, url.pathname + url.search);
}

// ============================================================================
// Auth Resolver
// ============================================================================

async function resolveAuth(request: NextRequest): Promise<AuthState> {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const payload = await verifyAuthCookie(cookie);

  if (!payload) {
    return { authenticated: false, role: null };
  }

  return {
    authenticated: true,
    role: payload.role,
  };
}

// ============================================================================
// Middleware Handlers
// ============================================================================

type MiddlewareHandler = (
  request: NextRequest,
  auth: AuthState,
) => NextResponse | null;

const handleGuestOnly: MiddlewareHandler = (request, auth) => {
  if (!auth.authenticated) return null;

  if (auth.role === UserRole.Admin || auth.role === UserRole.SuperAdmin) {
    return redirect(request, ROUTE_OBJECT.DASHBOARD);
  }

  return redirect(request, ROUTE_OBJECT.HOME);
};

const handleSuperAdmin: MiddlewareHandler = (request, auth) => {
  if (!auth.authenticated) {
    return redirectWithCallback(request, ROUTE_OBJECT.ADMIN_LOGIN);
  }

  if (auth.role !== UserRole.SuperAdmin) {
    return redirect(request, ROUTE_OBJECT.DASHBOARD);
  }

  return null;
};

const handleAdmin: MiddlewareHandler = (request, auth) => {
  if (!auth.authenticated) {
    return redirectWithCallback(request, ROUTE_OBJECT.ADMIN_LOGIN);
  }

  if (auth.role !== UserRole.Admin && auth.role !== UserRole.SuperAdmin) {
    return redirect(request, ROUTE_OBJECT.HOME);
  }

  return null;
};

const handleAuthRequired: MiddlewareHandler = (request, auth) => {
  if (!auth.authenticated) {
    return redirectWithCallback(request, ROUTE_OBJECT.USER_LOGIN);
  }

  return null;
};

// ============================================================================
// Main Middleware
// ============================================================================

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (isStaticPath(pathname) || match(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  const auth = await resolveAuth(request);

  if (match(pathname, GUEST_ONLY_PATHS)) {
    return handleGuestOnly(request, auth) ?? NextResponse.next();
  }

  if (match(pathname, SUPER_ADMIN_ONLY_PATHS)) {
    return handleSuperAdmin(request, auth) ?? NextResponse.next();
  }

  if (match(pathname, ADMIN_ONLY_PATHS)) {
    return handleAdmin(request, auth) ?? NextResponse.next();
  }

  if (match(pathname, AUTH_REQUIRED_PATHS)) {
    return handleAuthRequired(request, auth) ?? NextResponse.next();
  }

  return NextResponse.next();
}

// ============================================================================
// Config
// ============================================================================

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
