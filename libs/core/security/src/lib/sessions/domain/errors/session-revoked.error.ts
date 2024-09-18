import { ExceptionBase } from '@goran/common';

export class SessionRevokedError extends ExceptionBase {
    static readonly message = 'Session is revoked';

    public readonly code = 'SESSION.REVOKED';

    constructor(cause?: Error, metadata?: unknown) {
        super(SessionRevokedError.message, cause, metadata);
    }
}
