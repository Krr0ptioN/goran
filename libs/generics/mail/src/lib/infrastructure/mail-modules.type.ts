import { Simplify } from 'type-fest';
import { ResendInfraProviderOption, ResendProviderOptions } from './resend';
import { MailerInfraProviderOption, MailerProviderOptions } from './mailer';
import {
    DisabledInfraProviderOption,
    DisabledProviderOptions,
} from './disabled';

export type MailInfraProvider =
    | MailerInfraProviderOption
    | ResendInfraProviderOption
    | DisabledInfraProviderOption;

export type MailInfraProviderOptions = Simplify<
    MailerProviderOptions | ResendProviderOptions | DisabledProviderOptions
>;

export interface MailOptions {
    provider: MailInfraProvider;
    options: MailInfraProviderOptions;
}
