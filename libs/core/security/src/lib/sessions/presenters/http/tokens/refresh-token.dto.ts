import { IsJWT, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenInput {
    @IsNotEmpty()
    @IsJWT()
    @ApiProperty()
    token: string;
}
