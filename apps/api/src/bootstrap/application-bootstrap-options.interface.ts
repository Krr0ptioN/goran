import { DatabaseOptions } from '@goran/drizzle-data-access';
import { MailOptions } from '@goran/mail';
import { SecurityOptions } from '@goran/security';

export interface ApplicationBootstrapOptions {
    port: number;
    security: SecurityOptions;
    mail: MailOptions;
    database: DatabaseOptions;
}
