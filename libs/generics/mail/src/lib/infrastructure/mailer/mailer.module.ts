import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailProvider } from '../../application/ports/mail-provider.port';
import { MailerMailProvider } from './mailer.adapter';
import { MailerProviderOptions } from './mailer.module-options';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
    providers: [
        {
            provide: MailProvider,
            useClass: MailerMailProvider,
        },
    ],
    exports: [MailProvider],
})
export class MailerProviderModule {
    static register(options: MailerProviderOptions) {
        return {
            module: MailerProviderModule,
            imports: [
                MailerModule.forRootAsync({
                    useFactory: () => ({
                        transport: {
                            host: options.host,
                            port: options.port,
                            secure: options.secure,
                            auth: options.auth,
                        },
                        defaults: {
                            from: options.from,
                        },
                        template: {
                            dir: process.cwd() + '/templates/',
                            adapter: new EjsAdapter(),
                            options: { strict: true },
                        },
                    }),
                }),
            ],
            providers: [
                {
                    provide: MailProvider,
                    useClass: MailerMailProvider,
                },
                MailerMailProvider,
            ],
            exports: [MailProvider, MailerMailProvider],
        };
    }
}
