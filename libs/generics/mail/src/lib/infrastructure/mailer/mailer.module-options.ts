export type MailerInfraProviderOption = 'mailer';
export interface MailerProviderOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    from: string;
}
