import {
    Body,
    ClassSerializerInterceptor,
    ConflictException as ConflictHttpException,
    Controller,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { SignInDto } from './signin.dto';
import { SignUpDto } from './signup.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from './swagger';
import { CommandBus } from '@nestjs/cqrs';
import {
    AuthenticationCredentialDto,
    JwtAuthGuard,
    SignInCommand,
    SignOutCommand,
    SignUpCommand,
} from '../../application';
import { CurrentUser, UserEntity } from '@goran/users';
import { Result, match } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import { SignInSuccessResponse } from './signin.response';
import { SignUpSuccessResponse } from './signup.resonse';
import { SignOutSuccessResponse } from './sign-out.resonse';
import { Request } from 'express';
import { UserAgent } from '@goran/common';
import { TokensService } from '../../../tokens';
import { GetMeSuccessResponse } from './get-me.resonse';

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthenticationController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly tokensService: TokensService
    ) { }

    @ApiOkResponse({ type: SignUpSuccessResponse })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signup })
    @Post('sign-up')
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
                new SignUpCommand({ ...body, clientInfo })
            );

        match(result, {
            Ok: (credential: AuthenticationCredentialDto) => {
                return new SignUpSuccessResponse({
                    accessToken: credential.tokens.accessToken,
                    refreshToken: credential.tokens.refreshToken,
                    userId: credential.userId,
                });
            },
            Err: (error: ExceptionBase) => {
                throw error;
            },
        });
    }

    @ApiOkResponse({ type: SignInSuccessResponse })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signin })
    @Post('sign-in')
    async signIn(
        @Body() body: SignInDto,
        @Req() req: Request,
        @UserAgent() userAgent: string
    ) {
        const clientInfo = {
            ip: req.ip!,
            userAgent,
        };
        const result: Result<AuthenticationCredentialDto, ExceptionBase> =
            await this.commandBus.execute(
                new SignInCommand({ ...body, clientInfo })
            );

        match(result, {
            Ok: (credential: AuthenticationCredentialDto) => {
                return new SignInSuccessResponse({
                    accessToken: credential.tokens.accessToken,
                    refreshToken: credential.tokens.refreshToken,
                    userId: credential.userId,
                });
            },
            Err: (error: ExceptionBase) => {
                throw error;
            },
        });
    }

    @ApiOkResponse({ type: SignOutSuccessResponse })
    @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signout })
    @UseGuards(JwtAuthGuard)
    @Post('sign-out')
    async signOut(@Req() req: Request, @CurrentUser() user: UserEntity) {
        const signOutResult: Result<true, ExceptionBase> =
            await this.commandBus.execute(
                new SignOutCommand({
                    userId: user.id,
                    refreshToken:
                        this.tokensService.extractTokenFromRequest(req),
                })
            );

        match(signOutResult, {
            Ok: () => {
                return new SignOutSuccessResponse();
            },
            Err: (error: ExceptionBase) => {
                throw error;
            },
        });
    }

    @ApiOkResponse({ type: GetMeSuccessResponse })
    @ApiOperation({})
    @UseGuards(JwtAuthGuard)
    @Post('@me')
    async getMe(@CurrentUser() user: UserEntity) {
        return new GetMeSuccessResponse({
            userId: user.id,
            email: user.getProps().email,
            fullname: user.getProps().fullname,
            username: user.getProps().username,
        });
    }
}
