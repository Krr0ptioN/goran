import { IsEmail, IsOptional, IsDefined } from 'class-validator';
import { IsPassword, IsUsername } from '../../../../application';

export class SignInDto {
  @IsPassword()
  @IsDefined()
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUsername()
  username?: string;
}
