import { Controller, Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';
import { CommandBus } from '@nestjs/cqrs';
import {
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
} from './responses';
import { Result, match } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';

@ApiTags('auth', 'password-reset')
@Controller('auth/password-reset')
export class PasswordResetController {
    constructor(private readonly commandBus: CommandBus) {}

    @ApiOkResponse()
    @ApiOperation({
        summary: ApiDocsAuthentication.operationsSummary.passwordReset,
    })
    @Post('request')
    async reqResetPassword(@Body() credential: ResetPasswordDto) {
        const result = await this.commandBus.execute(
            new RequestUserPassswordResetCommand(credential)
        );
        return result;
    }

    @ApiOkResponse()
    @ApiOperation({
        summary: ApiDocsAuthentication.operationsSummary.passwordVerify,
    })
    @Post('verify')
    async verifyPassword(@Body credential: VerifyPasswordResetRequestDto) {
        const result = await this.commandBus.execute(
            new VerifyPasswordResetAttemptCommand(credential)
        );
        return result;
    }

    @ApiOkResponse()
    @ApiOperation({
        summary: ApiDocsAuthentication.operationsSummary.passwordVerify,
    })
    @Post('change')
    async resetPassword() {
        const result = await this.commandBus.execute(
            new ResetPasswordCommand(credential)
        );
        return result;
    }
}
