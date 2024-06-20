import { ExceptionBase } from '@goran/common';

export class EmailAlreadyRegisteredError extends ExceptionBase {
  static readonly message = 'Email is already registered';

  public readonly code = 'USER.EMAIL.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(EmailAlreadyRegisteredError.message, cause, metadata);
  }
}
