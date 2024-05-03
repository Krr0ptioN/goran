import { UserEntityMutation } from '../entities';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto implements UserEntityMutation {
  fullname: string | null;
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
