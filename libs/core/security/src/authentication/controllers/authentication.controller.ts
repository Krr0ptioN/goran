import { Body, Controller, Post, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from '../services';
import { LocalAuthGuard } from '../guards';
import { SignUpDto, SignInDto } from '../dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signup })
  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signin })
  @Post('signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signout })
  @Post('signout')
  signout(@Res({ passthrough: true }) res: Response) {
    return this.authService.signout(res);
  }
}
