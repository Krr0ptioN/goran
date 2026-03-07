import { Module } from '@nestjs/common';
import { MailProvider } from '../../application';
import { DisabledMailProvider } from './disabled.adapter';

@Module({
    providers: [
        {
            provide: MailProvider,
            useClass: DisabledMailProvider,
        },
    ],
    exports: [MailProvider],
})
export class DisabledProviderModule {
    static register() {
        return {
            module: DisabledProviderModule,
            providers: [
                {
                    provide: MailProvider,
                    useClass: DisabledMailProvider,
                },
                DisabledMailProvider,
            ],
            exports: [MailProvider, DisabledMailProvider],
        };
    }
}
