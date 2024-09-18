import { ExceptionBase } from '@goran/common';

export class ProvideUsernameOrEmailError extends ExceptionBase {
    static readonly message = 'Either username or email must be provided';
    public readonly code = 'AUTH.PROVIDE_USERNAME_OR_EMAIL';

    constructor(cause?: Error, metadata?: unknown) {
        super(ProvideUsernameOrEmailError.message, cause, metadata);
    }
}
