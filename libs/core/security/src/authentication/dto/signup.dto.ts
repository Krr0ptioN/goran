import {
    IsEmail,
    Matches,
    IsNotEmpty,
    MinLength,
    IsOptional,
    MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(20, { message: 'Password must not exceed 20 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/, {
        message:
            'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
    })
    @ApiProperty()
    password: string;

    @ApiPropertyOptional()
    @Matches(/^[a-z0-9_.-]{3,17}$/, {
        message:
            "Only username that contain lowercase letters, numbers, '_', '-' and '.' with min 3 max 17 length",
    })
    username: string;

    @IsOptional()
    @ApiProperty()
    fullname: string;
}
