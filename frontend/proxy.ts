/* eslint-disable max-lines */
import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { ROUTE_OBJECT } from './utils/constants';

// ============================================================================
// Constants
// ============================================================================

const PUBLIC_PATHS = [
  ROUTE_OBJECT.HOME,
  ROUTE_OBJECT.PRODUCTS,
  ROUTE_OBJECT.CATEGORIES,
  ROUTE_OBJECT.ABOUT,
  ROUTE_OBJECT.CONTACT,
];

const GUEST_ONLY_PATHS = [ROUTE_OBJECT.ADMIN_LOGIN, ROUTE_OBJECT.USER_LOGIN];

const ADMIN_ONLY_PATHS = [ROUTE_OBJECT.DASHBOARD];

const SUPER_ADMIN_ONLY_PATHS = [ROUTE_OBJECT.D_ROLES];

const AUTH_REQUIRED_PATHS = [
  ROUTE_OBJECT.PROFILE,
  ROUTE_OBJECT.ORDERS,
  ROUTE_OBJECT.CHECKOUT,
  ROUTE_OBJECT.CART,
];

const COOKIE_SECRET =
  process.env.COOKIE_SECRET ||
  process.env.NEXT_PUBLIC_COOKIE_SECRET ||
  'your-secret-key';

const COOKIE_NAME = 'authState';
const SEPARATOR = '.';

// ============================================================================
// Types
// ============================================================================

type UserRole = 'admin' | 'customer' | 'super-admin';

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
// Crypto Helper
// ============================================================================

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

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/[=]/g, '');
}

function decodePayload(encoded: string): AuthStatePayload | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

async function verifySignedAuthState(
  cookieValue: string,
): Promise<AuthStatePayload | null> {
  if (!cookieValue) return null;

  const parts = cookieValue.split(SEPARATOR);
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;

  const expectedSignature = await createSignature(encodedPayload);
  if (signature !== expectedSignature) {
    return null;
  }

  const payload = decodePayload(encodedPayload);
  if (!payload) return null;

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

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

function redirect(request: NextRequest, path: string): NextResponse {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

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

function handleGuestOnlyPaths(
  request: NextRequest,
  auth: AuthState,
): NextResponse | null {
  if (!auth.isAuthenticated) return null;

  if (auth.role === 'admin' || auth.role === 'super-admin') {
    return redirect(request, ROUTE_OBJECT.DASHBOARD);
  }
  return redirect(request, ROUTE_OBJECT.HOME);
}

function handleAdminOnlyPaths(
  request: NextRequest,
  auth: AuthState,
): NextResponse | null {
  if (!auth.isAuthenticated) {
    return redirectWithCallback(request, ROUTE_OBJECT.ADMIN_LOGIN);
  }

  if (auth.role !== 'admin' && auth.role !== 'super-admin') {
    return redirect(request, ROUTE_OBJECT.HOME);
  }

  return null;
}

function handleSuperAdminOnlyPaths(
  request: NextRequest,
  auth: AuthState,
): NextResponse | null {
  if (!auth.isAuthenticated) {
    return redirectWithCallback(request, ROUTE_OBJECT.ADMIN_LOGIN);
  }

  if (auth.role !== 'super-admin') {
    return redirect(request, ROUTE_OBJECT.DASHBOARD);
  }

  return null;
}

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

  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  const auth = await getAuthState(request);

  if (matchesPath(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  if (matchesPath(pathname, GUEST_ONLY_PATHS)) {
    return handleGuestOnlyPaths(request, auth) ?? NextResponse.next();
  }

  if (matchesPath(pathname, SUPER_ADMIN_ONLY_PATHS)) {
    return handleSuperAdminOnlyPaths(request, auth) ?? NextResponse.next();
  }

  if (matchesPath(pathname, ADMIN_ONLY_PATHS)) {
    return handleAdminOnlyPaths(request, auth) ?? NextResponse.next();
  }

  if (matchesPath(pathname, AUTH_REQUIRED_PATHS)) {
    return handleAuthRequiredPaths(request, auth) ?? NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
