import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookies } from '@goran/ui-module-auth/server';

const protectedRoutes = ['/'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // Read cookies from the request in middleware
  const accessCookie = req.cookies.get('session-access')?.value;
  const refreshCookie = req.cookies.get('session-refresh')?.value;

  // If trying to visit a protected route and there's obviously no session, go to sign-in
  if (isProtectedRoute && !(accessCookie || refreshCookie)) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // Only verify when we have any session cookies or we are on a protected route.
  // (Avoid unnecessary verification on public routes without cookies.)
  let sessionOk = false;
  let session: { userId?: string } | null = null;

  if (accessCookie || refreshCookie || isProtectedRoute) {
    const sessionVerificationResult = await verifySessionCookies({
      accessCookie,
      refreshCookie,
    });

    if (sessionVerificationResult.isOk()) {
      sessionOk = true;
      session = sessionVerificationResult.unwrap();
    }
  }

  // If on a protected route and verification failed, redirect to sign-in
  if (isProtectedRoute && !sessionOk) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // If on a public route and already signed in, send them home
  if (isPublicRoute && sessionOk) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// (Optional) Avoid running on static assets and APIs
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
