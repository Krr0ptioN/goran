/* eslint-disable @nx/enforce-module-boundaries */
import { ApplicationBootstrapOptions } from 'apps/api/src/bootstrap';
import { generateTestPassword } from '@goran/utils';
/* eslint-enable @nx/enforce-module-boundaries */

export const testOptions: ApplicationBootstrapOptions = {
    port: 0, // OS picks free port for tests
    security: {
        expiresIn: '15m',
        refreshIn: '7d',
        bcryptSalt: '10',
        jwtAccessSecret:
            process.env.JWT_ACCESS_SECRET ?? generateTestPassword(),
        jwtRefreshSecret:
            process.env.JWT_REFRESH_SECRET ?? generateTestPassword(),
    },
    mail: {
        provider: 'resend',
        options: {
            apiKey: process.env.RESEND_API_KEY ?? generateTestPassword(),
        },
    },
    fileStorage: {
        provider: 'minio',
        options: {
            endpoint: 'localhost',
            port: 9000,
            useSSL: false,
            keys: {
                access: process.env.MINIO_ACCESS_KEY ?? generateTestPassword(),
                secret: process.env.MINIO_SECRET_KEY ?? generateTestPassword(),
            },
            bucketName: 'songs',
        },
    },
    database: {
        host: 'localhost',
        port: 5432,
        database: 'test',
        user: 'u',
        password: process.env.DB_PASS ?? process.env.DB_USER ?? '',
    },
};
