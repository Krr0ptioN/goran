import { Controller } from '@nestjs/common';
import { Body, Param, Post } from '@nestjs/common';
import { AuthenticationPasswordService } from '../services';
import { PasswordForResetPasswordDto, ResetPasswordDto } from '../dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';

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
  @Post('reset')
  async reqResetPassword(@Body() credential: ResetPasswordDto) {
    const result = await this.passwordService.requestResetPassword(credential);
    return result;
  }

  @ApiOkResponse()
  @ApiOperation({
    summary: ApiDocsAuthentication.operationsSummary.passwordVerify,
  })
  @Post(':token/verify')
  async verifyPassword(
    @Body() input: PasswordForResetPasswordDto,
    @Param('token') token: string
  ) {
    const result = await this.passwordService.verifyPasswordResetAttempt(
      input,
      token
    );
    return result;
  }
}
