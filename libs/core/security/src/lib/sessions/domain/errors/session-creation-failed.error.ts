import { ExceptionBase } from '@goran/common';

export class SessionCreationFailedError extends ExceptionBase {
    static readonly message = 'Failed to create session';

    public readonly code = 'SESSION.CREATE_FAILED';

    constructor(cause?: Error, metadata?: unknown) {
        super(SessionCreationFailedError.message, cause, metadata);
    }
}
