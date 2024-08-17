import { Injectable } from '@nestjs/common';
import { Mail, MailProvider } from './mail-provider.interface';
import { ResendService } from 'nestjs-resend';

@Injectable()
export class ResendMailProvider implements MailProvider {
  constructor(private readonly resendService: ResendService) {}

  send(mail: Mail) {
    this.resendService.send(mail);
  }
}
