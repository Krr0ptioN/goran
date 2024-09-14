import {
    Body,
    ClassSerializerInterceptor,
    ConflictException as ConflictHttpException,
    Controller,
    Post,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { SignInDto } from './signin.dto';
import { SignUpDto } from './signup.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from './swagger';
import { CommandBus } from '@nestjs/cqrs';
import {
    AuthenticationCredentialDto,
    SigninCommand,
    SignupCommand,
} from '../../application';
import { UserAlreadyExistsError } from '@goran/users';
import { Result, match } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import { SignInSuccessResponse } from './signin.response';
import { SignUpSuccessResponse } from './signup.resonse';
import { Request } from 'express';
import { UserAgent } from '@goran/common';

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthenticationController {
    constructor(private readonly commandBus: CommandBus) { }

    @ApiOkResponse({ type: SignUpSuccessResponse })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signup })
    @Post('signup')
    async signUp(
        @Body() body: SignUpDto, 
        @Req() req: Request,
        @UserAgent() userAgent: string
    ) {
        const clientInfo = {
            ip: req.ip!,
            userAgent,
        };
        const result: Result<AuthenticationCredentialDto, ExceptionBase> =
            await this.commandBus.execute(
                new SignupCommand({ ...body, clientInfo })
            );

        match(result, {
            Ok: (credential: AuthenticationCredentialDto) => {
                return new SignUpSuccessResponse({
                    accessToken: credential.tokens.accessToken,
                    refreshToken: credential.tokens.refreshToken,
                    userId: credential.userId,
                });
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
    async signIn(@Body() body: SignInDto,
                @Req() req: Request,
                @UserAgent() userAgent: string
    ) {
        const clientInfo = {
            ip: req.ip!,
            userAgent,
        };
        const result: Result<AuthenticationCredentialDto, ExceptionBase> =
            await this.commandBus.execute(new SigninCommand({...body, clientInfo}));

        match(result, {
            Ok: (credential: AuthenticationCredentialDto) => {
                return new SignInSuccessResponse({
                    accessToken: credential.tokens.accessToken,
                    refreshToken: credential.tokens.refreshToken,
                    userId: credential.userId,
                });
            },
            Err: (error: Error) => {
                if (error instanceof ExceptionBase)
                    throw new ConflictHttpException(error);
                throw error;
            },
        });
    }
}
