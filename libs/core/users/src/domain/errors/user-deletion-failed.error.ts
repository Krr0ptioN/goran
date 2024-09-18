import { ExceptionBase } from '@goran/common';

export class UserDeletionFailedError extends ExceptionBase {
    static readonly message = 'User deletion failed';

    public readonly code = 'USER.DELETION_FAILED';

    constructor(cause?: Error, metadata?: unknown) {
        super(UserDeletionFailedError.message, cause, metadata);
    }
}
