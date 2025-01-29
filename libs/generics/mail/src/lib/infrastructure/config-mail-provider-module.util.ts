import { DynamicModule } from '@nestjs/common';
import {
    MailInfraProvider,
    MailInfraProviderOptions,
} from './mail-modules.type';
import { MailerProviderModule, MailerProviderOptions } from './mailer';
import { ResendProviderModule, ResendProviderOptions } from './resend';

export function isMailerProviderOptionsCorrect(
    options: MailInfraProviderOptions
): options is MailerProviderOptions {
    return 'host' in options && 'port' in options && 'auth' in options;
}

export function isResendProviderOptionsCorrect(
    options: MailInfraProviderOptions
): options is ResendProviderOptions {
    return 'apiKey' in options;
}

export function configMailProviderModule({
    options,
    provider,
}: {
    provider: MailInfraProvider;
    options: MailInfraProviderOptions;
}): DynamicModule {
    if (provider === 'resend' && isResendProviderOptionsCorrect(options)) {
        return ResendProviderModule.register(options);
    } else if (
        provider === 'mailer' &&
        isMailerProviderOptionsCorrect(options)
    ) {
        return MailerProviderModule.register(options);
    } else {
        throw new Error('Invalid mail provider configuration');
    }
}
