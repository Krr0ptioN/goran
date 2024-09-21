import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        API_BASE_URL: z.string().min(1),
    },
    client: {},
    runtimeEnv: {
        API_BASE_URL: z.string().min(1),
    },
});
