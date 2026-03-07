'use server';
import 'server-only';
import { Err, Ok, Result } from 'oxide.ts';
import { getUserInfo, UserInfo } from './get-user-info.action';
import { getFreshTokens } from './refresh-token.action';

export type VerifiedSession = UserInfo & {
    refreshedTokens?: {
        accessToken: string;
        refreshToken: string;
    };
};

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
}): Promise<Result<VerifiedSession, { error: string }>> {
    try {
        const info = await getUserInfo(accessCookie);
        return Ok(info);
    } catch {
        try {
            if (!refreshCookie) {
                return Err({ error: 'Missing refresh token' });
            }

            const credential = await getFreshTokens(refreshCookie);

            const info = await getUserInfo(credential.accessToken);

            return Ok({
                ...info,
                refreshedTokens: {
                    accessToken: credential.accessToken,
                    refreshToken: credential.refreshToken,
                },
            });
        } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            return Err({ error: 'Token refresh failed' });
        }
    }
}
