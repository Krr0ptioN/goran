'use server';
import 'server-only';

import { fetchApi } from '@goran/ui-common';

/**
 * Refreshes the token using the refresh cookie.
 * @param refreshCookie - The refresh token cookie.
 * @returns Error message or refreshed token data.
 */
export async function refreshToken(refreshCookie?: string) {
    const res = await fetchApi(`/auth/token/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {},
        body: JSON.stringify({ token: refreshCookie }),
    });

    if (!res.ok) {
        throw new Error('Failed to refresh token');
    }

    const refreshResult = await res.json();
    return { error: refreshResult.error || 'Token refresh failed' };
}
