import { Injectable } from '@nestjs/common';
import { ResendService } from 'nestjs-resend';
import { MailProvider } from '../../application/ports/mail-provider.port';
import { MailDto } from '../../application';
import { RequireAtLeastOne } from 'type-fest';

@Injectable()
export class ResendMailProvider implements MailProvider {
    constructor(private readonly resendService: ResendService) {}

    public send(mail: RequireAtLeastOne<MailDto, 'html' | 'text'>) {
        this.resendService.send({
            subject: mail.subject,
            from: mail.from,
            to: mail.to,
            text: mail.text,
            html: mail.html,
            react: null,
        });
    }
}
