import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configSchema } from '@goran/config';
import { ApplicationBootstrapOptions } from '../bootstrap';
import { UsersModule } from '@goran/users';
import { AuthenticationModule } from '@goran/security';
import { DatabaseModule } from '@goran/drizzle-data-access';
import { MailModule } from '@goran/mail';

@Module({
    imports: [ConfigModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    static register(options: ApplicationBootstrapOptions) {
        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: ['.env', '.env.local'],
                    validationSchema: configSchema,
                }),
                UsersModule,
                AuthenticationModule,
                DatabaseModule.forRoot(options.database),
                MailModule.register(options.mail),
            ],
        };
    }
}
