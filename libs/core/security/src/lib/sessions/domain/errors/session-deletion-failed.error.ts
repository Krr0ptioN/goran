import { ExceptionBase } from '@goran/common';

export class SessionDeletionFailedError extends ExceptionBase {
    static readonly message = 'Failed to delete session';

    public readonly code = 'SESSION.DELETION_FAILED';

    constructor(cause?: Error, metadata?: unknown) {
        super(SessionDeletionFailedError.message, cause, metadata);
    }
}
