import {
    Controller,
    Body,
    Post,
    UseGuards,
    Req,
    BadRequestException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import {
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
import { PasswordResetRequestAggregate } from '../../../domain';
import { TokensService } from '../../../../tokens';

@ApiTags('auth', 'password-reset')
@Controller('auth/password-reset')
export class PasswordResetController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly tokenService: TokensService
    ) { }

    @ApiOkResponse()
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
    @UseGuards(JwtPasswordResetSessionGuard)
    @Post('verify')
    async verifyPassword(
        @Req() req: Request,
        @Body() credential: VerifyPasswordResetRequestDto
    ) {
        const token = this.tokenService.extractTokenFromRequest(req);
        const result: Result<PasswordResetRequestAggregate, ExceptionBase> =
            await this.commandBus.execute(
                new VerifyPasswordResetAttemptCommand({
                    token,
                    email: credential.email,
                    otpcode: credential.otpcode,
                })
            );

        return match(result, {
            Ok: (agg) => {
                return new VerifyPasswordResetRequestResponse();
            },
            Err: (error: ExceptionBase) => {
                throw new BadRequestException(error);
            },
        });
    }

    @ApiOkResponse()
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
