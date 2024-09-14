import { ResponseBase } from '@goran/common';

export class ResetPasswordResponse extends ResponseBase {
    constructor() {
        super({
            message: 'Password is reseted successfully',
            code: 'PASSWORD_RESETED',
            success: true,
        });
    }
}
