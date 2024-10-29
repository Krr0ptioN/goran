'use server';
import 'server-only';

import { cookies } from 'next/headers';

export async function setAccessToken(accessToken: string) {
    const expiresAtAccess = new Date(Date.now() + 5 * 60 * 60 * 1000);

    cookies().set('session-access', accessToken, {
        httpOnly: true,
        secure: true,
        expires: expiresAtAccess,
        sameSite: 'lax',
        path: '/',
    });
}

export async function setRefreshToken(refreshToken: string) {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    cookies().set('session-refresh', refreshToken, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}
