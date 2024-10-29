import { fetchApi } from '@goran/ui-common';

export interface UserInfo {
    userId: string;
    email: string;
}

/**
 * Fetches user data using the access cookie.
 * @param accessCookie - The access token cookie.
 * @returns User data or an error.
 */
export async function getUserInfo(accessCookie?: string): Promise<UserInfo> {
    const res = await fetchApi(
        `/auth/@me`,
        {
            credentials: 'include',
        },
        accessCookie
    );

    if (!res.ok) {
        throw new Error('Failed to fetch user data');
    }

    const result = await res.json();
    return {
        userId: result.data.userId,
        email: result.data.email,
    };
}
