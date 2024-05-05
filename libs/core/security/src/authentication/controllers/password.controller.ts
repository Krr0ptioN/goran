import { Controller } from '@nestjs/common';
import { Body, Param, Post } from '@nestjs/common';
import { AuthenticationPasswordService } from '../services';
import { PasswordForResetPasswordDto, ResetPasswordDto } from '../dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';

@Controller('auth/password')
export class AuthenticationPasswordController {
  constructor(
    private readonly passwordService: AuthenticationPasswordService
  ) {}

  @ApiOperation({
    summary: ApiDocsAuthentication.operationsSummary.passwordReset,
  })
  @Post('reset')
  reqResetPassword(@Body() credential: ResetPasswordDto) {
    return this.passwordService.requestResetPassword(credential);
  }

  @ApiOperation({
    summary: ApiDocsAuthentication.operationsSummary.passwordVerify,
  })
  @Post(':token/verify')
  verifyPassword(
    @Body() input: PasswordForResetPasswordDto,
    @Param('token') token: string
  ) {
    return this.passwordService.verifyPasswordResetAttempt(input, token);
  }
}
