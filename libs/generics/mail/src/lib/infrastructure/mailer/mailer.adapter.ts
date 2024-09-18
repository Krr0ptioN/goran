import { Injectable } from '@nestjs/common';
import { MailProvider } from '../../application/ports/mail-provider.port';
import { MailerService } from '@nestjs-modules/mailer';
import { MailDto } from '../../application/dtos';

@Injectable()
export class MailerMailProvider implements MailProvider {
    constructor(private readonly mailerService: MailerService) {}

    public send(mail: MailDto): void {
        this.mailerService.sendMail({});
    }
}
