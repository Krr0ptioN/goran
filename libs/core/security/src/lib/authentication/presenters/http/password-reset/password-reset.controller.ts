import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';
import { CommandBus } from '@nestjs/cqrs';
import {
    AuthenticationTokenService,
    JwtPasswordResetSessionGuard,
    RequestUserPassswordResetCommand,
    ResetPasswordCommand,
    VerifyPasswordResetAttemptCommand,
} from '../../../application';
import {
    VerifyPasswordResetRequestDto,
    RequestPasswordResetDto,
    ResetPasswordDto,
} from './dtos';
import {
    VerifyPasswordResetRequestResponse,
    RequestPasswordResetResponse,
    ResetPasswordResponse,
    RequestPasswordResetResponseProps,
} from './responses';
import { Result, match } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import { Request } from 'express';

@ApiTags('auth', 'password-reset')
@Controller('auth/password-reset')
export class PasswordResetController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly tokenService: AuthenticationTokenService
    ) {}

    @ApiOkResponse()
    @ApiOperation({
        summary: ApiDocsAuthentication.operationsSummary.passwordReset,
    })
    @Post('request')
    async reqResetPassword(@Body() credential: RequestPasswordResetDto) {
        const result: Result<RequestPasswordResetResponseProps, ExceptionBase> =
            await this.commandBus.execute(
                new RequestUserPassswordResetCommand(credential)
            );

        return match(result, {
            Ok: ({ resetToken }) =>
                new RequestPasswordResetResponse({ resetToken }),
            Err: (error: Error) => {
                throw error;
            },
        });
    }

    @ApiOkResponse()
    @ApiOperation({
        summary: ApiDocsAuthentication.operationsSummary.passwordVerify,
    })
    @UseGuards(JwtPasswordResetSessionGuard)
    @Post('verify')
    async verifyPassword(
        @Req() req: Request,
        @Body() credential: VerifyPasswordResetRequestDto
    ) {
        const token = this.tokenService.extractTokenFromRequest(req);
        const result: Result<any, ExceptionBase> =
            await this.commandBus.execute(
                new VerifyPasswordResetAttemptCommand({ ...credential, token })
            );

        return match(result, {
            Ok: () => new VerifyPasswordResetRequestResponse(),
            Err: (error: Error) => {
                throw error;
            },
        });
    }

    @ApiOkResponse()
    @ApiOperation({
        summary: ApiDocsAuthentication.operationsSummary.passwordVerify,
    })
    @UseGuards(JwtPasswordResetSessionGuard)
    @Post('reset')
    async resetPassword(
        @Req() req: Request,
        @Body() credential: ResetPasswordDto
    ) {
        const token = this.tokenService.extractTokenFromRequest(req);
        const result: Result<any, ExceptionBase> =
            await this.commandBus.execute(
                new ResetPasswordCommand({ ...credential, token })
            );

        return match(result, {
            Ok: () => new ResetPasswordResponse(),
            Err: (error: Error) => {
                throw error;
            },
        });
    }
}
