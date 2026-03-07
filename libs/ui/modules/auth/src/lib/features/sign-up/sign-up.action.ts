'use server';

import { fetchApi } from '@goran/ui-common';
import { SignUpSchema, SignUpValues } from './schema';
import { cookies } from 'next/headers';

/**
 * Server action to handle user sign-in.
 * @param data - The sign-in data.
 * @returns Result containing user credentials or an error.
 */
export async function signUp(data: SignUpValues) {
    const validatedFields = SignUpSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            message: 'Invalid field values',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    const response = await fetchApi('/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
        const errorData = await response
            .json()
            .catch(() => ({ message: 'Internal server error' }));

        return {
            message: errorData.message ?? 'Internal server error',
            errors: {
                root: [errorData.message ?? 'Internal server error'],
            },
        };
    }

    const res = await response.json();
    const session = await cookies();
    const isSecureCookie = process.env.NODE_ENV === 'production';

    session.set('session-access', res.data.accessToken, {
        httpOnly: true,
        secure: isSecureCookie,
        expires: new Date(Date.now() + 5 * 60 * 60 * 1000),
        sameSite: 'lax',
        path: '/',
    });

    session.set('session-refresh', res.data.refreshToken, {
        httpOnly: true,
        secure: isSecureCookie,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: 'lax',
        path: '/',
    });

    return { message: res.message, code: res.code };
}
