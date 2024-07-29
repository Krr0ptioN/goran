import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from '../services';
import { SignInDto } from './signin.dto';
import { SignUpDto } from './signup.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';
import { UserAuthenticationResponse } from '../responses';

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) { }

    @ApiOkResponse({ type: UserAuthenticationResponse })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signup })
    @Post('signup')
    async signUp(@Body() body: SignUpDto) {
        const data = await this.authService.signup(body);
        const res: UserAuthenticationResponse = {
            data: {
                tokens: data.tokens,
                user: new SafeUserEntityInfo(data.user),
            },
            message: 'User signed up successfully',
        };
        return res;
    }

    @ApiOkResponse({ type: UserAuthenticationResponse })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signin })
    @Post('signin')
    async signIn(@Body() body: SignInDto) {
        const data = await this.authService.signin(body);
        const res: UserAuthenticationResponse = {
            data: { tokens: data.tokens, user: new SafeUserEntityInfo(data.user) },
            message: 'User signed up successfully',
        };
        return res;
    }
}
