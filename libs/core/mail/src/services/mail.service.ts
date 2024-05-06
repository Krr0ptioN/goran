import { Inject, Injectable } from '@nestjs/common';
import {
  MailProviderToken,
  Mail,
  MailProvider,
} from '../providers/mail-provider.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(MailProviderToken) private readonly mailProvider: MailProvider
  ) {}
  send(mail: Mail) {
    return this.mailProvider.send(mail);
  }
}
