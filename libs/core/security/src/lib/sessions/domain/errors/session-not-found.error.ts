import { ExceptionBase } from '@goran/common';

export class SessionNotFoundError extends ExceptionBase {
    static readonly message = 'Session not found';

    public readonly code = 'SESSION.NOT_FOUND';

    constructor(cause?: Error, metadata?: unknown) {
        super(SessionNotFoundError.message, cause, metadata);
    }
}
