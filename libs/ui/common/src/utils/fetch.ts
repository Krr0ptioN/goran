import { CONFIG_APP } from '@goran/config';

export const fetchApi = <T = any>(
    endpoint: string,
    ops: object = { headers: {} },
    token?: string
) => {
    const baseURL = process.env[CONFIG_APP.API_BASE_URL];
    ops['headers'] = {
        ...(ops['headers'] || {}),
    };

    if (token)
        Object.assign(ops['headers'], { Authorization: `Bearer ${token}` });

    return fetch(`${baseURL}${endpoint}`, ops);
};
