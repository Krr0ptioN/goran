import { ApiProperty } from '@nestjs/swagger';
import { Token } from '../entities';
import { SignUpDto } from './signup.dto';

export class SignInDto extends SignUpDto {
  @ApiProperty()
  token: Token;
}
