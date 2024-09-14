import { IsEmail, IsDefined, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsPassword } from '@goran/security';
import { IsUsername } from '@goran/users';
import { Optional } from '@goran/common';

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

    @IsOptional()
    @ApiPropertyOptional()
    fullname: Optional<string>;
}
