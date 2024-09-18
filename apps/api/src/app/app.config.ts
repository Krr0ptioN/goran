import { CONFIG_APP } from '@goran/config';
import type { MailInfraProvider, MailInfraProviderOptions } from '@goran/mail';
import { ApplicationBootstrapOptions } from '../bootstrap';
import 'dotenv/config';

export default (): ApplicationBootstrapOptions => ({
    port: parseInt(process.env[CONFIG_APP.SERVER_PORT]!) || 3000,
    security: {
        expiresIn: process.env[CONFIG_APP.SECURITY_EXPIRES_IN]!,
        refreshIn: process.env[CONFIG_APP.SECURITY_REFRESH_IN]!,
        bcryptSalt: process.env[CONFIG_APP.SECURITY_BCRYPT_SALT]!,
        jwtRefreshSecret: process.env[CONFIG_APP.JWT_ACCESS_SECRET]!,
        jwtAccessSecret: process.env[CONFIG_APP.JWT_REFRESH_SECRET]!,
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
        host: process.env[CONFIG_APP.DB_HOST]!,
        port: Number.parseInt(process.env[CONFIG_APP.DB_PORT]!),
        database: process.env[CONFIG_APP.DB_DATABASE]!,
        user: process.env[CONFIG_APP.DB_USER]!,
        password: process.env[CONFIG_APP.DB_PASSWORD]!,
    },
});
