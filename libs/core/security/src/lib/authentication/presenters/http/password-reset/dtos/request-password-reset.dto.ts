import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}
