import { FetchOptions, ofetch } from 'ofetch';
import { CONFIG_APP } from '@goran/config';

export const $fetch = ofetch.create({
    baseURL: process.env[CONFIG_APP.API_BASE_URL],
});

export const fetcher = <T = any>(
    url: string,
    ops: FetchOptions<'json'> = {},
    token?: string
) => {
    ops['headers'] = {
        ...(ops?.headers || {}),
    };

    if (token)
        Object.assign(ops['headers'], { Authorization: `Bearer ${token}` });

    return $fetch<T>(url, ops);
};

export const fetch = fetcher;
