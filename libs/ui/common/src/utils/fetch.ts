'use server';
import 'server-only';

import { env } from '../env';

export const fetchApi = (
    endpoint: string,
    ops: RequestInit = { headers: {} },
    token?: string
) => {
    ops.headers = {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...(ops['headers'] || {}),
    };

    return fetch(`${env.API_BASE_URL}${endpoint}`, ops);
};
