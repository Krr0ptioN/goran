import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPasswordResetRequestDto {
    @IsNotEmpty()
    @Length(6)
    @ApiProperty()
    otpcode: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}
