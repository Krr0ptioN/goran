import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGenreDto {
    @ApiProperty()
    @IsString()
    ownerId: string;

    @ApiProperty()
    @IsString()
    name: string;
}
