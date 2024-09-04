import { Module } from '@nestjs/common';
import { MailProvider } from '../../application';
import { ResendModule } from 'nestjs-resend';
import { ResendMailProvider } from './resend.adapter';
import { ResendProviderOptions } from './resend.module-options';

@Module({
    providers: [
        {
            provide: MailProvider,
            useClass: ResendMailProvider,
        },
    ],
    exports: [MailProvider],
})
export class ResendProviderModule {
    static register(options: ResendProviderOptions) {
        return {
            module: ResendProviderModule,
            imports: [
                ResendModule.forRoot({
                    apiKey: options.apiKey,
                }),
            ],
            providers: [
                {
                    provide: MailProvider,
                    useClass: ResendMailProvider,
                },
                ResendMailProvider,
            ],
            exports: [MailProvider, ResendMailProvider],
        };
    }
}
