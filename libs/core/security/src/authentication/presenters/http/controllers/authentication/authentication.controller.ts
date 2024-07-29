import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SignInDto } from './signin.dto';
import { SignUpDto } from './signup.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocsAuthentication } from '../swagger';
import { UserAuthenticationResponse } from '../../dto/responses';
import { CommandBus } from '@nestjs/cqrs';
import { SigninCommand, SignupCommand } from '../../../../application';

@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOkResponse({ type: UserAuthenticationResponse })
  @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signup })
  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    const data = await this.commandBus.execute(new SignupCommand(body));
    const res: UserAuthenticationResponse = {
      data,
      message: 'User signed up successfully',
    };
    return res;
  }

  @ApiOkResponse({ type: UserAuthenticationResponse })
  @ApiOperation({ summary: ApiDocsAuthentication.operationsSummary.signin })
  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    const data = await this.commandBus.execute(new SigninCommand(body));
    const res: UserAuthenticationResponse = {
      data,
      message: 'User signed up successfully',
    };
    return res;
  }
}
