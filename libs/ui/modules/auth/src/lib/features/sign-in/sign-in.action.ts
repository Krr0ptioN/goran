import { fetchApi } from '@goran/ui-common';
import { SignInSchema, SignInValues, initialState } from './schema';

export async function signIn(state, userCredentials: SignInValues) {
    const apiRes = await fetchApi('/auth/signin', { body: userCredentials });
}
