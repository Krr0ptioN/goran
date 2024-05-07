import { UserEntityMutation } from '../entities';
import {
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto implements UserEntityMutation {
    @IsDefined()
    fullname: string | null;
    @IsString()
    @MinLength(4, { message: 'Username must be at least 4 characters long' })
    @MaxLength(20, { message: 'Username cannot be longer than 20 characters' })
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message:
            'Username can only contain letters, numbers, underscores, and hyphens',
    })
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
