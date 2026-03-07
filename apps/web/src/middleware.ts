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
    let refreshedTokens: {
        accessToken: string;
        refreshToken: string;
    } | null = null;

    if (accessCookie || refreshCookie || isProtectedRoute) {
        const sessionVerificationResult = await verifySessionCookies({
            accessCookie,
            refreshCookie,
        });

        if (sessionVerificationResult.isOk()) {
            sessionOk = true;
            const session = sessionVerificationResult.unwrap();
            refreshedTokens = session.refreshedTokens ?? null;
        }
    }

    const withRefreshedCookies = (response: NextResponse) => {
        if (!refreshedTokens) {
            return response;
        }

        const isSecureCookie = process.env.NODE_ENV === 'production';

        response.cookies.set('session-access', refreshedTokens.accessToken, {
            httpOnly: true,
            secure: isSecureCookie,
            expires: new Date(Date.now() + 5 * 60 * 60 * 1000),
            sameSite: 'lax',
            path: '/',
        });

        response.cookies.set('session-refresh', refreshedTokens.refreshToken, {
            httpOnly: true,
            secure: isSecureCookie,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sameSite: 'lax',
            path: '/',
        });

        return response;
    };

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
        return withRefreshedCookies(NextResponse.redirect(url));
    }

    return withRefreshedCookies(NextResponse.next());
}

// (Optional) Avoid running on static assets and APIs
export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};
