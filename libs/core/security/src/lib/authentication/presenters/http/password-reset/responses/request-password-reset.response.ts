import { ResponseBase } from '@goran/common';

export class RequestPasswordResetResponse extends ResponseBase {
    constructor() {
        super({
            message:
                'Password Reset resquested, check your email for OTP verification code',
            code: 'PASSWORD_RESET_REQUESTED',
            success: true,
        });
    }
}
