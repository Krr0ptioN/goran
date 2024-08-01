import {
    Body,
    ClassSerializerInterceptor,
    ConflictException as ConflictHttpException,
    Controller,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { SignInDto } from './signin.dto';
import { SignUpDto } from './signup.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';
import { UserAuthenticatedDto } from '../user-authenticated.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SigninCommand, SignupCommand } from '../../../application';
import { UserAlreadyExistsError } from '@goran/users';
import { Result, match } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import { UserAuthenticationCredentialsVO } from '../../../domain';

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthenticationController {
    constructor(private readonly commandBus: CommandBus) { }

    @ApiOkResponse({ type: UserAuthenticatedDto })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signup })
    @Post('signup')
    async signUp(@Body() body: SignUpDto) {
        const result: Result<UserAuthenticationCredentialsVO, ExceptionBase> =
            await this.commandBus.execute(new SignupCommand(body));
        return match(result, {
            Ok: (credential) => ({
                tokens: credential.tokens,
                userId: credential.user.getProps().id,
            }),
            Err: (error: Error) => {
                if (error instanceof UserAlreadyExistsError)
                    throw new ConflictHttpException(error.message);
                throw error;
            },
        });
    }

    @ApiOkResponse({ type: UserAuthenticatedDto })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signin })
    @Post('signin')
    async signIn(@Body() body: SignInDto) {
        const result: Result<UserAuthenticationCredentialsVO, ExceptionBase> =
            await this.commandBus.execute(new SigninCommand(body));

        return match(result, {
            Ok: (credential: UserAuthenticationCredentialsVO) => new UserAuthenticatedDto({
                tokens: credential.tokens,
                userId: credential.user.getProps().id,
            }),
            Err: (error: Error) => {
                if (error instanceof ExceptionBase)
                    throw new ConflictHttpException(error.message);
                throw error;
            },
        });
    }
}
