import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordForResetPasswordDto {
    @IsNotEmpty()
    @Length(6)
    @ApiProperty()
    otpcode: string;
}
