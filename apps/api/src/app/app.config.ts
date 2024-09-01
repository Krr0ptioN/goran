import { CONFIG_APP } from '@goran/config';
import type { MailInfraProvider, MailInfraProviderConfig } from '@goran/mail';
import { ApplicationBootstrapOptions } from '../bootstrap';
import 'dotenv/config';

export default (): ApplicationBootstrapOptions => ({
    mail: {
        provider: process.env[CONFIG_APP.MAIL_INFRA] as MailInfraProvider,
        config: {
            host: process.env[CONFIG_APP.MAIL_HOST],
            port: process.env[CONFIG_APP.MAIL_PORT],
            secure: process.env[CONFIG_APP.MAIL_SECURE],
            auth: {
                user: process.env[CONFIG_APP.MAIL_SECURE],
                pass: process.env[CONFIG_APP.MAIL_SECURE],
            },
            from: process.env[CONFIG_APP.MAIL_FROM],
            apiKey: process.env[CONFIG_APP.RESEND_GORAN_API],
        } as MailInfraProviderConfig,
    },
    database: {
        host: process.env[CONFIG_APP.DB_HOST],
        port: Number.parseInt(process.env[CONFIG_APP.DB_PORT]),
        database: process.env[CONFIG_APP.DB_DATABASE],
        user: process.env[CONFIG_APP.DB_USER],
        password: process.env[CONFIG_APP.DB_PASSWORD],
    },
});
