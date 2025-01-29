import { CONFIG_APP } from '@goran/config';
import type { MailInfraProvider, MailInfraProviderOptions } from '@goran/mail';
import { ApplicationBootstrapOptions } from '../bootstrap';
import 'dotenv/config';
import { FilesInfraProvider, FilesInfraProviderOptions } from '@goran/files';

export default (): ApplicationBootstrapOptions => ({
    port: parseInt(process.env[CONFIG_APP.SERVER_PORT] ?? '3000'),
    security: {
        expiresIn: process.env[CONFIG_APP.SECURITY_EXPIRES_IN] ?? '1h',
        refreshIn: process.env[CONFIG_APP.SECURITY_REFRESH_IN] ?? '7d',
        bcryptSalt: process.env[CONFIG_APP.SECURITY_BCRYPT_SALT] ?? '10',
        jwtRefreshSecret: process.env[CONFIG_APP.JWT_ACCESS_SECRET] ?? 'secret',
        jwtAccessSecret: process.env[CONFIG_APP.JWT_REFRESH_SECRET] ?? 'secret',
    },
    fileStorage: {
        provider: process.env[CONFIG_APP.FILES_INFRA] as FilesInfraProvider,
        options: {
            endpoint: process.env[CONFIG_APP.FILES_MINIO_ENDPOINT],
            port: parseInt(process.env[CONFIG_APP.FILES_MINIO_PORT] ?? '9000'),
            useSSL: !!process.env[CONFIG_APP.FILES_MINIO_USE_SSL],
            keys: {
                secret: process.env[CONFIG_APP.FILES_MINIO_ACCESSKEY],
                access: process.env[CONFIG_APP.FILES_MINIO_SECRETKEY],
            },
            bucketName: process.env[CONFIG_APP.FILES_MINIO_BUCKETNAME],
        } as FilesInfraProviderOptions,
    },
    mail: {
        provider: process.env[CONFIG_APP.MAIL_INFRA] as MailInfraProvider,
        options: {
            host: process.env[CONFIG_APP.MAIL_HOST],
            port: process.env[CONFIG_APP.MAIL_PORT],
            secure: process.env[CONFIG_APP.MAIL_SECURE],
            auth: {
                user: process.env[CONFIG_APP.MAIL_SECURE],
                pass: process.env[CONFIG_APP.MAIL_SECURE],
            },
            from: process.env[CONFIG_APP.MAIL_FROM],
            apiKey: process.env[CONFIG_APP.RESEND_GORAN_API],
        } as MailInfraProviderOptions,
    },
    database: {
        host: process.env[CONFIG_APP.DB_HOST] ?? 'localhost',
        port: Number.parseInt(process.env[CONFIG_APP.DB_PORT] ?? '5432'),
        database: process.env[CONFIG_APP.DB_DATABASE] ?? 'goran',
        user: process.env[CONFIG_APP.DB_USER] ?? 'goran',
        password: process.env[CONFIG_APP.DB_PASSWORD] ?? 'goran',
    },
});
