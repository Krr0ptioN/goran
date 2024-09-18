import { ExceptionBase } from '@goran/common';

export class PasswordResetRequestAttemptInvalidatedError extends ExceptionBase {
    static readonly message = 'Password reset request attempt is invalidated';
    public readonly code = 'AUTH.PASSWORD_RESET.REQUEST_INVALIDATED';

    constructor(cause?: Error, metadata?: unknown) {
        super(
            PasswordResetRequestAttemptInvalidatedError.message,
            cause,
            metadata
        );
    }
}
