import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuth = req.cookies.get('isAuth')?.value;
  const role = req.cookies.get('userRole')?.value;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  if (!isAuth && pathname.startsWith('/dashboard')) {
    const redirect = NextResponse.redirect(new URL('/', req.url));
    redirect.headers.set('x-middleware-cache', 'no-cache');
    return redirect;
  }

  if (pathname.startsWith('/dashboard')) {
    if (role === 'customer') {
      const redirect = NextResponse.redirect(new URL('/', req.url));
      redirect.headers.set('x-middleware-cache', 'no-cache');
      return redirect;
    }

    if (pathname.startsWith('/dashboard/users') && role !== 'admin') {
      const redirect = NextResponse.redirect(
        new URL('/dashboard/blogs', req.url),
      );
      redirect.headers.set('x-middleware-cache', 'no-cache');
      return redirect;
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
