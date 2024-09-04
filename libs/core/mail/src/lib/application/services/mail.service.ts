import { Injectable } from '@nestjs/common';
import { MailProvider } from '../ports/mail-provider.port';
import { MailDto } from '../dtos';

@Injectable()
export class MailService {
    constructor(private readonly mailProvider: MailProvider) {}
    send(mail: MailDto) {
        return this.mailProvider.send(mail);
    }
}
