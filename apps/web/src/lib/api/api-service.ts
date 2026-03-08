type RequestOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
};

export class ApiService {
    constructor(private readonly baseUrl = '') {}

    async get<T>(path: string, init?: RequestOptions) {
        return this.request<T>(path, {
            ...init,
            method: 'GET',
        });
    }

    async post<T>(path: string, body?: unknown, init?: RequestOptions) {
        return this.request<T>(path, {
            ...init,
            method: 'POST',
            body,
        });
    }

    private async request<T>(path: string, options: RequestOptions) {
        const { body, headers, ...rest } = options;

        const response = await fetch(`${this.baseUrl}${path}`, {
            ...rest,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(headers ?? {}),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
        });

        if (!response.ok) {
            const fallbackMessage = `Request failed with status ${response.status}`;
            try {
                const payload = (await response.json()) as {
                    error?: string;
                    message?: string;
                };
                throw new Error(
                    payload.error ?? payload.message ?? fallbackMessage,
                );
            } catch {
                throw new Error(fallbackMessage);
            }
        }

        if (response.status === 204) {
            return null as T;
        }

        return (await response.json()) as T;
    }
}
