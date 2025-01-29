import { DatabaseOptions } from '@goran/drizzle-data-access';
import { MailOptions } from '@goran/mail';
import { SecurityOptions } from '@goran/security';
import { FileStorageOptions } from '@goran/files';

export interface ApplicationBootstrapOptions {
    port: number;
    security: SecurityOptions;
    fileStorage: FileStorageOptions;
    mail: MailOptions;
    database: DatabaseOptions;
}
