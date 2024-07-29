import { IsEmail, IsDefined, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsPassword, IsUsername } from '../../../../application';

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
  fullname?: string | null;
}
