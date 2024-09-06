import {
    Body,
    Res,
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
import { CommandBus } from '@nestjs/cqrs';
import {
    AuthenticationCredentialDto,
    SigninCommand,
    SignupCommand,
} from '../../../application';
import { UserAlreadyExistsError } from '@goran/users';
import { Result, match } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import { Response } from 'express';
import { SignInSuccessResponse } from './signin.response';
import { SignUpSuccessResponse } from './signup.resonse';

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthenticationController {
    constructor(private readonly commandBus: CommandBus) { }

    @ApiOkResponse({ type: SignUpSuccessResponse })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signup })
    @Post('signup')
    async signUp(@Body() body: SignUpDto, @Res() res: Response) {
        const result: Result<AuthenticationCredentialDto, ExceptionBase> =
            await this.commandBus.execute(new SignupCommand(body));

        match(result, {
            Ok: (credential: AuthenticationCredentialDto) => {
                res.cookie('refreshToken', credential.tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });

                res.send(
                    new SignUpSuccessResponse({
                        accessToken: credential.tokens.accessToken,
                        userId: credential.userId,
                    })
                );
            },
            Err: (error: Error) => {
                if (error instanceof UserAlreadyExistsError)
                    throw new ConflictHttpException(error);
                throw error;
            },
        });
    }

    @ApiOkResponse({ type: SignInSuccessResponse })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signin })
    @Post('signin')
    async signIn(@Body() body: SignInDto, @Res() res: Response) {
        const result: Result<AuthenticationCredentialDto, ExceptionBase> =
            await this.commandBus.execute(new SigninCommand(body));

        match(result, {
            Ok: (credential: AuthenticationCredentialDto) => {
                res.cookie('refresh_token', credential.tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });

                res.send(
                    new SignInSuccessResponse({
                        accessToken: credential.tokens.accessToken,
                        userId: credential.userId,
                    })
                );
            },
            Err: (error: Error) => {
                if (error instanceof ExceptionBase)
                    throw new ConflictHttpException(error);
                throw error;
            },
        });
    }
}
