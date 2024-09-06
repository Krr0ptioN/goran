import { ExceptionBase } from '@goran/common';

export class InvalidOtpCodeError extends ExceptionBase {
    static readonly message = 'Invalid otpcode is provided';
    public readonly code = 'AUTH.PASSWORD_RESET.INVALID_OTPCODE';

    constructor(cause?: Error, metadata?: unknown) {
        super(InvalidOtpCodeError.message, cause, metadata);
    }
}
