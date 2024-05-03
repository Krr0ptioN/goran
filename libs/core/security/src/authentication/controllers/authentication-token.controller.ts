import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards';
import { RefreshTokenInput } from '../dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';
import { InvalidTokenError } from '../errors';
import { AuthenticationTokenService } from '../services';
import { CurrentUser, UserEntity } from '@goran/users';
import { Request } from 'express';

@Controller('auth/token')
export class AuthenticationTokenController {
  constructor(private readonly tokenService: AuthenticationTokenService) {}

  @ApiOperation({
    summary: ApiDocsAuthentication.operationsSummary.revokeSession,
  })
  @UseGuards(LocalAuthGuard)
  @Post(':token/revoke')
  async revokeSession(@Param('token') token: string) {
    return this.tokenService.revokeToken(token);
  }

  @ApiOperation({
    summary: ApiDocsAuthentication.operationsSummary.refreshToken,
  })
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Body() refershTokenInput: RefreshTokenInput,
    @CurrentUser() user: UserEntity
  ) {
    const refreshToken = refershTokenInput.token || req.cookies.refreshToken;
    if (!refreshToken) {
      return new InvalidTokenError('Invalid token provided');
    }
    const newToken = await this.tokenService.refreshToken(user, refreshToken);
    return { accessToken: newToken };
  }
}
