import { ResponseBase } from '@goran/common';

export interface RequestPasswordResetResponseProps {
    resetToken: string;
}

export class RequestPasswordResetResponse<
    RequestPasswordResetResponseProps
> extends ResponseBase<RequestPasswordResetResponseProps> {
    constructor(props: RequestPasswordResetResponseProps) {
        super({
            message:
                'Password Reset resquested, check your email for OTP verification code',
            code: 'PASSWORD_RESET_REQUESTED',
            success: true,
            data: props,
        });
    }
}
