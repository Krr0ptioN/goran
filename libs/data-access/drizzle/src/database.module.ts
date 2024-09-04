import { Global, Module } from '@nestjs/common';
import {
    ConfigurableDatabaseModule,
    CONNECTION_POOL,
    DATABASE_OPTIONS,
} from './database.module-definition';
import { DatabaseOptions } from './database-options';
import { Pool } from 'pg';
import { DrizzleService } from './drizzle.service';

@Global()
@Module({
    exports: [DrizzleService],
    providers: [
        DrizzleService,
        {
            provide: CONNECTION_POOL,
            inject: [DATABASE_OPTIONS],
            useFactory: (options: DatabaseOptions) => {
                return new Pool({
                    host: options.host,
                    port: options.port,
                    user: options.user,
                    password: options.password,
                    database: options.database,
                });
            },
        },
    ],
})
export class DatabaseModule extends ConfigurableDatabaseModule { }
