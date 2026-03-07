import { CONFIG_APP } from '@goran/config';
import type { MailInfraProvider, MailInfraProviderOptions } from '@goran/mail';
import { ApplicationBootstrapOptions } from '../bootstrap';
import 'dotenv/config';
import { FilesInfraProvider, FilesInfraProviderOptions } from '@goran/files';

function parseNumber(value: string | undefined, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (!value) {
        return fallback;
    }

    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export default (): ApplicationBootstrapOptions => ({
    port: parseNumber(process.env[CONFIG_APP.SERVER_PORT], 3000),
    security: {
        expiresIn: process.env[CONFIG_APP.SECURITY_EXPIRES_IN] ?? '1h',
        refreshIn: process.env[CONFIG_APP.SECURITY_REFRESH_IN] ?? '7d',
        bcryptSalt: process.env[CONFIG_APP.SECURITY_BCRYPT_SALT] ?? '10',
        jwtRefreshSecret: process.env[CONFIG_APP.JWT_REFRESH_SECRET] as string,
        jwtAccessSecret: process.env[CONFIG_APP.JWT_ACCESS_SECRET] as string,
    },
    fileStorage: {
        provider: (process.env[CONFIG_APP.FILES_INFRA] ??
            'minio') as FilesInfraProvider,
        options: {
            endpoint:
                process.env[CONFIG_APP.FILES_MINIO_ENDPOINT] ?? 'localhost',
            port: parseNumber(process.env[CONFIG_APP.FILES_MINIO_PORT], 9000),
            useSSL: parseBoolean(
                process.env[CONFIG_APP.FILES_MINIO_USE_SSL],
                false,
            ),
            keys: {
                access:
                    process.env[CONFIG_APP.FILES_MINIO_ACCESSKEY] ??
                    'minioadmin',
                secret:
                    process.env[CONFIG_APP.FILES_MINIO_SECRETKEY] ??
                    'minioadmin',
            },
            bucketName:
                process.env[CONFIG_APP.FILES_MINIO_BUCKETNAME] ?? 'goran',
        } as FilesInfraProviderOptions,
    },
    mail: {
        // Temporarily keep email delivery disabled in local/dev flows.
        // Switch MAIL_INFRA to "mailer" or "resend" when local email infra is ready.
        provider: (process.env[CONFIG_APP.MAIL_INFRA] ??
            'disabled') as MailInfraProvider,
        options: {
            host: process.env[CONFIG_APP.MAIL_HOST] ?? 'localhost',
            port: parseNumber(process.env[CONFIG_APP.MAIL_PORT], 1025),
            secure: parseBoolean(process.env[CONFIG_APP.MAIL_SECURE], false),
            auth: {
                user: process.env[CONFIG_APP.MAIL_USER] ?? '',
                pass: process.env[CONFIG_APP.MAIL_PASSWORD] ?? '',
            },
            from:
                process.env[CONFIG_APP.MAIL_FROM] ??
                'Goran <noreply@goran.local>',
            apiKey: process.env[CONFIG_APP.RESEND_GORAN_API],
        } as MailInfraProviderOptions,
    },
    database: {
        host: process.env[CONFIG_APP.DB_HOST] ?? 'localhost',
        port: parseNumber(process.env[CONFIG_APP.DB_PORT], 5432),
        database: process.env[CONFIG_APP.DB_DATABASE] ?? 'goran',
        user: process.env[CONFIG_APP.DB_USER] ?? 'admin',
        password: process.env[CONFIG_APP.DB_PASSWORD] ?? 'admin',
    },
});
