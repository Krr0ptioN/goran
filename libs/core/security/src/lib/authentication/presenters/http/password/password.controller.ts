import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { AuthenticationPasswordService } from '../../../application/services';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';
import { ResetPasswordDto } from './reset-password.dto';

@ApiTags('auth', 'password')
@Controller('auth/password')
export class AuthenticationPasswordController {
  constructor(
    private readonly passwordService: AuthenticationPasswordService
  ) {}

  @ApiOkResponse()
  @ApiOperation({
    summary: ApiDocsAuthentication.operationsSummary.passwordReset,
  })
  @Post('request-reset')
  async reqResetPassword(@Body() credential: ResetPasswordDto) {
    const result = await this.passwordService.requestResetPassword(credential);
    return result;
  }

  @ApiOkResponse()
  @ApiOperation({
    summary: ApiDocsAuthentication.operationsSummary.passwordVerify,
  })
  @Post('/verify')
  async verifyPassword() {
    const result = await this.passwordService.verifyPasswordResetAttempt();
    return result;
  }

  @ApiOkResponse()
  @ApiOperation({
    summary: ApiDocsAuthentication.operationsSummary.passwordVerify,
  })
  @Post('/reset')
  async resetPassword() {
    const result = await this.passwordService.verifyPasswordResetAttempt();
    return result;
  }
}
