import { MailService } from './application/services';
import { MailOptions, configMailProviderModule } from './infrastructure';

export class MailModule {
    static register(mailOptions: MailOptions) {
        const mailProviderModule = configMailProviderModule(mailOptions);
        return {
            module: MailModule,
            global: true,
            imports: [mailProviderModule],
            providers: [MailService],
            exports: [MailService],
        };
    }
}
