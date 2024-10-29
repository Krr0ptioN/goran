import { ResponseBase } from '@goran/common';

export interface GetMeSuccessResponseProps {
    email: string;
    username: string;
    fullname?: string;
    userId: string;
}

export class GetMeSuccessResponse<
    GetMeSuccessResponseProps
> extends ResponseBase<GetMeSuccessResponseProps> {
    constructor(props: GetMeSuccessResponseProps) {
        super({
            data: props,
            message: 'Your info successfully retrieved',
            success: true,
            code: 'GET_ME_SUCCESS',
        });
    }
}
