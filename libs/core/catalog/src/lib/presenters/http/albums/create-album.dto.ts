import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayUnique,
    IsArray,
    IsDateString,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateAlbumDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @IsOptional()
    @IsDateString()
    releasedDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    coverImageKey?: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsString({ each: true })
    producerIds?: string[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsString({ each: true })
    songIds?: string[];
}
