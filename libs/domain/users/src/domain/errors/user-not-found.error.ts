import { ExceptionBase } from '@goran/common';

export class UserNotFoundError extends ExceptionBase {
  static readonly message = 'User not found';

  public readonly code = 'USER.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserNotFoundError.message, cause, metadata);
  }
}
