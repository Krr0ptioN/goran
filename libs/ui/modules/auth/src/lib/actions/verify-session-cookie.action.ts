'use server';
import 'server-only';
import { Err, Ok, Result } from 'oxide.ts';
import { getUserInfo, UserInfo } from './get-user-info.action';
import { getFreshTokens } from './refresh-token.action';
import { setAccessToken, setRefreshToken } from './session-set.action';

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
}): Promise<Result<UserInfo, { error: string }>> {
    try {
        const info = await getUserInfo(accessCookie);
        return Ok(info);
    } catch (error) {
        try {
            const crednetial = await getFreshTokens(refreshCookie);
            setAccessToken(crednetial.accessToken);
            setRefreshToken(crednetial.refreshToken);

            const info = await getUserInfo(accessCookie);
            return Ok(info);
        } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            return Err({ error: 'Token refresh failed' });
        }
    }
}
