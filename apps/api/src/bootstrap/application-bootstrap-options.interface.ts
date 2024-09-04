import { DatabaseOptions } from '@goran/drizzle-data-access';
import { MailOptions } from '@goran/mail';

export interface ApplicationBootstrapOptions {
    mail: MailOptions;
    database: DatabaseOptions;
}
