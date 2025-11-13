import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'pokedex-session';
const PROTECTED_PATHS = ['/', '/pokedex', '/pokemon'];

function isProtectedPath(pathname: string) {
  if (pathname === '/') {
    return true;
  }

  return PROTECTED_PATHS.some(path => {
    if (path === '/') {
      return pathname === '/';
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

function sanitizeRedirect(target: string | null) {
  if (!target || !target.startsWith('/') || target.startsWith('//')) {
    return null;
  }

  return target;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const isLoggedIn = request.cookies.get(SESSION_COOKIE)?.value === 'authenticated';

  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/pokedex', request.url));
  }

  if (isProtectedPath(pathname) && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    const redirectTarget = sanitizeRedirect(`${pathname}${search}`);

    if (redirectTarget && redirectTarget !== '/login') {
      loginUrl.searchParams.set('redirectTo', redirectTarget);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
