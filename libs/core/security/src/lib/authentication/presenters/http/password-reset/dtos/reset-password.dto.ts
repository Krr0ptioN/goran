import { IsEmail, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from '../../../../application';

export class ResetPasswordDto {
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsPassword()
    @IsDefined()
    @ApiProperty()
    password: string;
}
