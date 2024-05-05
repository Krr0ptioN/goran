import {
    IsNotEmpty,
    IsString,
    IsEmail,
    IsOptional,
    MinLength,
    MaxLength,
    Matches,
} from 'class-validator';

export class SignInDto {
    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(20, { message: 'Password must not exceed 20 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, {
        message:
            'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
    })
    password: string;

    @IsNotEmpty({ message: 'Either email or username must be provided' })
    @IsString()
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsNotEmpty({ message: 'Either email or username must be provided' })
    @IsString()
    @IsOptional()
    @MaxLength(32)
    username?: string;
}
