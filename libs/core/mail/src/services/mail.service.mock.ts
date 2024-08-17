import { Mail } from '../providers/mail-provider.interface';

export class MailServiceMock {
    sentMails: Mail[] = [];
    send(mail: Mail) {
        return this.sentMails.push(mail);
    }
}
