import { IsEmail, IsOptional, IsDefined } from 'class-validator';
import { IsPassword } from '../../../password';
import { IsUsername } from '@goran/users';
import { Optional } from '@goran/common';

export class SignInDto {
    @IsPassword()
    @IsDefined()
    password: string;

    @IsOptional()
    @IsEmail()
    email: Optional<string>;

    @IsOptional()
    @IsUsername()
    username: Optional<string>;
}
