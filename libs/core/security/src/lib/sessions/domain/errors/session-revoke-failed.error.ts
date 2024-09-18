import { ExceptionBase } from '@goran/common';

export class SessionRevokeFailedError extends ExceptionBase {
    static readonly message = 'Failed to revoke session';

    public readonly code = 'SESSION.REVOKE_FAILED';

    constructor(cause?: Error, metadata?: unknown) {
        super(SessionRevokeFailedError.message, cause, metadata);
    }
}
