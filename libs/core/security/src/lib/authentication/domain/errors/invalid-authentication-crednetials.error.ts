import { ExceptionBase } from '@goran/common';

export class InvalidAuthenticationCredentials extends ExceptionBase {
  static readonly message = 'Provided credentials are invalid';
  public readonly code = 'AUTH.INVALID_CREDENTIALS';

  constructor(cause?: Error, metadata?: unknown) {
    super(InvalidAuthenticationCredentials.message, cause, metadata);
  }
}
