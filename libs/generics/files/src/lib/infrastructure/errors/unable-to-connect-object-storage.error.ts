import { ExceptionBase } from '@goran/common';

export class UnableToConnectObjectStorageInfra extends ExceptionBase {
    static readonly message = 'Provided credentials are invalid';
    public override readonly scope = 'infrastructure';
    public readonly code = 'AUTH.INVALID_CREDENTIALS';

    constructor(cause?: Error, metadata?: unknown) {
        super(UnableToConnectObjectStorageInfra.message, cause, metadata);
    }
}
