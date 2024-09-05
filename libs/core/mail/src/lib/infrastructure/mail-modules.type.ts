import { Simplify } from 'type-fest';
import { ResendInfraProviderOption, ResendProviderOptions } from './resend';
import { MailerInfraProviderOption, MailerProviderOptions } from './mailer';

export type MailInfraProvider =
    | MailerInfraProviderOption
    | ResendInfraProviderOption;

export type MailInfraProviderOptions = Simplify<
    MailerProviderOptions | ResendProviderOptions
>;

export interface MailOptions {
    provider: MailInfraProvider;
    options: MailInfraProviderOptions;
}
