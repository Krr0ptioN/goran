'use server';
import 'server-only';

import { getUserInfo } from './get-user-info.action';
import { refreshToken } from './refresh-token.action';

/**
 * Main function to verify session cookies.
 * @param accessCookie - The access token cookie.
 * @param refreshCookie - The refresh token cookie.
 * @returns User data or error message.
 */
export async function verifySessionCookies({
    accessCookie,
    refreshCookie,
}: {
    accessCookie?: string;
    refreshCookie?: string;
}) {
    try {
        return await getUserInfo(accessCookie);
    } catch (error) {
        console.error('Error fetching user data:', error);
        try {
            return await refreshToken(refreshCookie);
        } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            return { error: 'Token refresh failed' };
        }
    }
}
