'use server';
import 'server-only';

import { fetchApi } from '@goran/ui-common';

/**
 * Refreshes the token using the refresh cookie.
 * @param refreshCookie - The refresh token cookie.
 * @returns Access token or error message.
 */
export async function refreshToken(refreshCookie?: string) {
    const res = await fetchApi(`/auth/token/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json', // Set content type
        },
        body: JSON.stringify({ token: refreshCookie }),
    });

    if (!res.ok) {
        const errorData = await res.json(); // Get error details
        throw new Error(errorData.message || 'Failed to refresh token');
    }

    const refreshResult = await res.json();
    return { 
        accessToken: refreshResult.accessToken,
        refreshToken: refreshResult.refreshToken
    };
}
