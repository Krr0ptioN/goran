import { ResponseBase } from '@goran/common';

interface SignInResponseProps {
    accessToken: string;
    refreshToken: string;
    userId: string;
}

export class SignInSuccessResponse<
    SignInResponseProps
> extends ResponseBase<SignInResponseProps> {
    constructor(props: SignInResponseProps) {
        super({
            data: props,
            message: 'Signed in successfully',
            success: true,
            code: 'SIGNIN_SUCCESS',
        });
    }
}
