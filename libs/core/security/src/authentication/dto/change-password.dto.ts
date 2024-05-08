import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordForResetPasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  newPassword: string;
}
