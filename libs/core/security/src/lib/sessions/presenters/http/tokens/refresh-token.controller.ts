import { Body, Controller, Post, Req } from '@nestjs/common';
import { RefreshTokenInput } from './refresh-token.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@goran/users';
import { Request } from 'express';
import { InvalidTokenError } from '../../../../tokens';
import { SessionsService } from '../../../application';

@ApiTags('auth')
@Controller('auth/token/refresh')
export class RefreshTokenController {
    constructor(private readonly sessionsService: SessionsService) {}

    @ApiOkResponse()
    @Post()
    async refreshToken(
        @Req() req: Request,
        @Body() refershTokenInput: RefreshTokenInput,
        @CurrentUser() userId: string
    ) {
        const refreshToken =
            refershTokenInput.token || req.cookies.refreshToken;
        if (!refreshToken) {
            throw new InvalidTokenError();
        }
        const newToken =
            await this.sessionsService.refreshAccessTokenForSession(
                userId,
                refreshToken
            );
        return { accessToken: newToken };
    }
}
