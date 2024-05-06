import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '../services';
import { SignUpDto, SignInDto } from '../dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @ApiOkResponse()
  @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signup })
  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @ApiOkResponse()
  @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signin })
  @Post('signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }
}
