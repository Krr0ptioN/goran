import { ResponseBase } from '@goran/common';


export class SignOutSuccessResponse<
    SignOutResponseProps
> extends ResponseBase {
    constructor() {
        super({
            message: 'Signed out successfully',
            desc: 'Your session is obsolete and token is expired.',
            success: true,
            code: 'SIGNOUT_SUCCESS',
        });
    }
}
