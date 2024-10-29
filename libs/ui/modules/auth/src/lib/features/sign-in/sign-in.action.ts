'use server';

import { fetchApi } from '@goran/ui-common';
import { SignInSchema, SignInValues } from './schema';
import { setAccessToken, setRefreshToken } from '../../actions';

/**
 * Server action to handle user sign-in.
 * @param data - The sign-in data.
 * @returns Result containing user credentials or an error.
 */
export async function signIn(data: SignInValues) {
    const validatedFields = SignInSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            message: 'Invalid field values',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    const response = await fetchApi('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw { message: errorData.message };
    }

    const res = await response.json();

    setAccessToken(res.data.accessToken);
    setRefreshToken(res.data.refreshToken);

    return { message: res.message, code: res.code };
}
