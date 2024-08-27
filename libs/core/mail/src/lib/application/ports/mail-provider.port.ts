import { MailDto } from '../dtos';

export abstract class MailProvider {
    abstract send(mail: MailDto): void;
}
