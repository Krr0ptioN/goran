import { ExceptionBase } from '@goran/common';

export class PasswordResetRequestAlreadyVerifiedError extends ExceptionBase {
    static readonly message = 'Password reset request is already verified';
    public readonly code = 'AUTH.PASSWORD_RESET.ALREADY_VERIFIED';

    constructor(cause?: Error, metadata?: unknown) {
        super(
            PasswordResetRequestAlreadyVerifiedError.message,
            cause,
            metadata
        );
    }
}
