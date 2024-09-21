import { env } from '../env';

export const fetchApi = <T = any>(
    endpoint: string,
    ops: object = { headers: {} },
    token?: string
) => {
    ops['headers'] = {
        ...(ops['headers'] || {}),
    };

    if (token)
        Object.assign(ops['headers'], { Authorization: `Bearer ${token}` });

    return fetch(`${env.API_BASE_URL}${endpoint}`, ops);
};
