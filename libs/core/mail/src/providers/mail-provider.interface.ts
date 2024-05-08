export interface Mail {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export const MailProviderToken = Symbol('MailProviderToken');

export abstract class MailProvider {
  abstract send(mail: Mail): void;
}
