import { ExceptionBase } from '@goran/common';

export class UserAlreadyExistsError extends ExceptionBase {
  static readonly message = 'User already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserAlreadyExistsError.message, cause, metadata);
  }
}
