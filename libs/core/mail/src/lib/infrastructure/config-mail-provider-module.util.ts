import { DynamicModule } from '@nestjs/common';
import {
    MailInfraProvider,
    MailInfraProviderConfig,
} from './mail-modules.type';
import { MailerProviderModule, MailerProviderOptions } from './mailer';
import { ResendProviderModule, ResendProviderOptions } from './resend';

export function isMailerProviderConfig(
    config: MailInfraProviderConfig
): config is MailerProviderOptions {
    return 'host' in config && 'port' in config && 'auth' in config;
}

export function isResendProviderConfig(
    config: MailInfraProviderConfig
): config is ResendProviderOptions {
    return 'apiKey' in config;
}

export function configMailProviderModule({
    config,
    provider,
}: {
    provider: MailInfraProvider;
    config: MailInfraProviderConfig;
}): DynamicModule {
    if (provider === 'resend' && isResendProviderConfig(config)) {
        return ResendProviderModule.register(config);
    } else if (isMailerProviderConfig(config)) {
        return MailerProviderModule.register(config);
    } else {
        throw new Error('Invalid mail provider configuration');
    }
}
