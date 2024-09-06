import { ExceptionBase } from '@goran/common';

export class PasswordResetRequestMustBeVerifiedError extends ExceptionBase {
    static readonly message = 'Password reset request must be verified';
    public readonly code = 'AUTH.PASSWORD_RESET.MUST_BE_VERIFIED';

    constructor(cause?: Error, metadata?: unknown) {
        super(PasswordResetRequestMustBeVerifiedError.message, cause, metadata);
    }
}
