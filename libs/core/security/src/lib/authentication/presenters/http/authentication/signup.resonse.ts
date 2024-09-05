import { ResponseBase } from '@goran/common';

interface SignUpResponseProps {
    accessToken: string;
    userId: string;
}

export class SignUpSuccessResponse<
    SignUpResponseProps
> extends ResponseBase<SignUpResponseProps> {
    constructor(props: SignUpResponseProps) {
        super({
            data: props,
            message: 'Signed up successfully',
            success: true,
            code: 'SIGNUP_SUCCESS',
        });
    }
}
