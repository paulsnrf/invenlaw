import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

  // Explicitly ignore API routes and static assets
  if (
    pathname.startsWith('/api/') ||
    pathname.includes('/api/') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return;
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = cookieLocale && i18n.locales.includes(cookieLocale as any) 
      ? cookieLocale 
      : i18n.defaultLocale;

    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // Auth & Profile Completion Check
  const token = await getToken({ req: request });
  const locale = pathname.split('/')[1] || i18n.defaultLocale;
  
  // Update cookie if locale in URL is different from cookie
  let response = NextResponse.next();
  if (cookieLocale !== locale) {
    response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // 1 year
  }

  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
  const isWelcomePage = pathname.includes('/welcome');

  if (token) {
    const profileCompleted = (token as any).profileCompleted;

    // If logged in and on an auth page, redirect to home
    if (isAuthPage) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    // If profile not completed and not on welcome page, force redirect to welcome
    if (!profileCompleted && !isWelcomePage) {
      return NextResponse.redirect(new URL(`/${locale}/welcome`, request.url));
    }

    // If profile is already completed and trying to access welcome page, redirect to home
    if (profileCompleted && isWelcomePage) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  } else {
    // If not logged in and trying to access welcome, redirect to login
    if (isWelcomePage) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return response;
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and static files (images, icons)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
