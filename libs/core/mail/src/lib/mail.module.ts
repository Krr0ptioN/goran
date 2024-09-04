import { Module } from '@nestjs/common';
import { MailService } from './application/services';
import { MailOptions, configMailProviderModule } from './infrastructure';

export class MailModule {
    static register(mailOptions: MailOptions) {
        const mailProviderModule = configMailProviderModule(mailOptions);
        return {
            module: MailModule,
            imports: [mailProviderModule],
            providers: [MailService],
            exports: [MailService],
        };
    }
}
