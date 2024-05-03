import { IsEmail } from 'class-validator'

export class VadliateUserPasswordDto {
  @IsEmail()
  email: string;

  password: string;
}
