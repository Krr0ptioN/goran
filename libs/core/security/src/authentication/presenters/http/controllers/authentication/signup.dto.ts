import { IsEmail, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPassword, IsUsername } from '../../../../application';

export class SignUpDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsPassword()
  @IsDefined()
  @ApiProperty()
  password: string;

  @ApiProperty()
  @IsDefined()
  @IsUsername()
  username: string;

  @IsDefined()
  @ApiProperty()
  fullname: string | null;
}
