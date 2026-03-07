import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayUnique,
    IsArray,
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateSongDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty({ minimum: 1 })
    @IsInt()
    @Min(1)
    duration: number;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @IsOptional()
    @IsDateString()
    releasedDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    audioFileKey?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    coverImageKey?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    albumId?: string;

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
    genreIds?: string[];
}
