import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;

  const { pathname } = request.nextUrl;

  // Allow requests for static files and auth pages
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname === '/login' ||
    pathname === '/signup'
  ) {
    return NextResponse.next();
  }

  if (!authToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
