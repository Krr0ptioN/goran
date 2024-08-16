import { ExceptionBase } from '@goran/common';

export class UserCreationFailedError extends ExceptionBase {
  static readonly message = 'User creation failed';

  public readonly code = 'USER.CREATION_FAILED';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserCreationFailedError.message, cause, metadata);
  }
}
