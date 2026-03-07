import { Injectable } from '@nestjs/common';
import { MailProvider } from '../../application/ports/mail-provider.port';
import { MailDto } from '../../application/dtos';

@Injectable()
export class DisabledMailProvider implements MailProvider {
    send(_mail: MailDto): void {
        return;
    }
}
