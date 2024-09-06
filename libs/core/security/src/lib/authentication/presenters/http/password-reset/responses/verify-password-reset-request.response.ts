import { ResponseBase } from '@goran/common';

export class VerifyPasswordResetRequestResponse extends ResponseBase {
    constructor() {
        super({
            message: 'Verified password reset resquest ',
            code: 'VERIFIED_PASSWORD_RESET_REQUEST',
            success: true,
        });
    }
}
