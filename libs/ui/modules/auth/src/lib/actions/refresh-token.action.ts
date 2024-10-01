'use server';
import 'server-only';

import { fetchApi } from '@goran/ui-common';

/**
 * Refreshes the token using the refresh cookie.
 * @param refreshCookie - The refresh token cookie.
 * @returns Access token or error message.
 */
export async function getFreshTokens(refreshCookie?: string) {
    const res = await fetchApi(`/auth/token/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshCookie }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to refresh token');
    }

    const refreshResult = await res.json();
    return {
        accessToken: refreshResult.accessToken,
        refreshToken: refreshResult.refreshToken,
    };
}
