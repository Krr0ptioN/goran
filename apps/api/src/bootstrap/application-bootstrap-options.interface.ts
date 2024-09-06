import { DatabaseOptions } from '@goran/drizzle-data-access';
import { MailOptions } from '@goran/mail';

export interface ApplicationBootstrapOptions {
    port: number;
    mail: MailOptions;
    database: DatabaseOptions;
}
