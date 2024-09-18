import { ExceptionBase } from '@goran/common';

export class UnableDeleteRequestError extends ExceptionBase {
    static readonly message = 'Unable to delete the password reset request';
    public readonly code = 'AUTH.PASSWORD_RESET.INFRA.DELETED_UNABLED';

    constructor(cause?: Error, metadata?: unknown) {
        super(UnableDeleteRequestError.message, cause, metadata);
    }
}
