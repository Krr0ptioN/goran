import { ExceptionBase } from '@goran/common';

export class UnableSaveRequestError extends ExceptionBase {
    static readonly message = 'Unable to save the password reset request';
    public readonly code = 'AUTH.PASSWORD_RESET.INFRA.SAVE_UNABLED';

    constructor(cause?: Error, metadata?: unknown) {
        super(UnableSaveRequestError.message, cause, metadata);
    }
}
