import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect all requests to maintenance page
  // except the maintenance page itself and static assets
  const { pathname } = request.nextUrl;
  
  if (pathname === '/maintenance.html' || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  return NextResponse.rewrite(new URL('/maintenance.html', request.url));
}

export const config = {
  matcher: '/((?!maintenance.html|_next/static|_next/image|favicon.ico).*)',
};
