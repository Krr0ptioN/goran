import { SafeUserEntityInfo } from '@goran/users';
import { Token } from '../entities';
import { BaseResponse } from '@goran/types';

export class UserAuthenticationResponse extends BaseResponse {
    override data: {
        user: SafeUserEntityInfo;
        tokens: Token;
    };
}
