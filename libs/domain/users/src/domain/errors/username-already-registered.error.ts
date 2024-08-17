import { ExceptionBase } from '@goran/common';

export class UsernameAlreadyRegisteredError extends ExceptionBase {
  static readonly message = 'Username is already registered';

  public readonly code = 'USER.USERNAME.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(UsernameAlreadyRegisteredError.message, cause, metadata);
  }
}
