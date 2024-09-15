import { ExceptionBase } from '@goran/common';

export class InvalidTokenError extends ExceptionBase {
  static readonly message = 'Invalid Token provided';

  public readonly code = 'TOKEN.INVALID';

  constructor(cause?: Error, metadata?: unknown) {
    super(InvalidTokenError.message, cause, metadata);
  }
}
