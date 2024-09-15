import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configSchema } from '@goran/config';
import { ApplicationBootstrapOptions } from '../bootstrap';
import { UsersModule } from '@goran/users';
import {
    AuthenticationModule,
    PasswordResetModule,
    SessionsModule,
    TokensModule,
    PasswordModule,
} from '@goran/security';
import { DatabaseModule } from '@goran/drizzle-data-access';
import { MailModule } from '@goran/mail';
import { DeviceDetectorModule } from '@goran/device-detector';
import { IpLocatorModule } from '@goran/ip-locator';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';

export class AppModule {
    static register(options: ApplicationBootstrapOptions) {
        return {
            module: AppModule,
            controllers: [AppController],
            providers: [AppService],
            imports: [
                CqrsModule.forRoot(),
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: ['.env', '.env.local'],
                    validationSchema: configSchema,
                }),
                CacheModule.register({ isGlobal: true }),
                DatabaseModule.forRoot(options.database),
                MailModule.register(options.mail),
                JwtModule.register({
                    global: true,
                    secret: options.security.jwtAccessSecret,
                    signOptions: {
                        expiresIn: options.security.expiresIn,
                    },
                }),
                UsersModule,
                PasswordModule,
                TokensModule,
                IpLocatorModule,
                DeviceDetectorModule,
                SessionsModule.register({
                    refreshIn: options.security.refreshIn,
                }),
                AuthenticationModule,
                PasswordResetModule,
            ],
        };
    }
}
