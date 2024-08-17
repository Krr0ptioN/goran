import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}
