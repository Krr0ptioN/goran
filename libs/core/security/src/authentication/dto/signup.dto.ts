import {
  IsEmail,
  Matches,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Minmum password length is 8',
  })
  @ApiProperty()
  password: string;

  @IsOptional()
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
