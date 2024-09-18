import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookies } from '@goran/ui-module-auth/server';
import { cookies } from 'next/headers';

const protectedRoutes = ['/'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const accessCookie = cookies().get('session-access')?.value;
    const refreshCookie = cookies().get('session-refresh')?.value;

    if (isProtectedRoute && !(accessCookie || refreshCookie)) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
    }

    const session = await verifySessionCookies({ accessCookie, refetchCookie: refreshCookie });

    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
    }

    if (
        isPublicRoute &&
        session?.userId &&
        !req.nextUrl.pathname.startsWith('/')
    ) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    return NextResponse.next();
}
