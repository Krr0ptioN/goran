import { Body, Controller, Post, Req } from '@nestjs/common';
import { RefreshTokenInput } from './refresh-token.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';
import { CurrentUser } from '@goran/users';
import { Request } from 'express';
import { InvalidTokenError } from '../../../domain';
import { AuthenticationTokenService } from '../../../application';

@ApiTags('auth', 'token')
@Controller('auth/token')
export class AuthenticationTokenController {
    constructor(private readonly tokenService: AuthenticationTokenService) {}

    @ApiOperation({
        summary: ApiDocsAuthentication.operationsSummary.refreshToken,
    })
    @ApiOkResponse()
    @Post('refresh')
    async refreshToken(
        @Req() req: Request,
        @Body() refershTokenInput: RefreshTokenInput,
        @CurrentUser() userId: string
    ) {
        const refreshToken =
            refershTokenInput.token || req.cookies.refreshToken;
        if (!refreshToken) {
            return new InvalidTokenError('Invalid token provided');
        }
        const newToken = await this.tokenService.refreshAccessToken(
            userId,
            refreshToken
        );
        return { accessToken: newToken };
    }
}
