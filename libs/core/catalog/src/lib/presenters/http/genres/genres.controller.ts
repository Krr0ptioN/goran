import {
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { match } from 'oxide.ts';
import { CatalogRecordNotFoundError, GenreEntity } from '../../../domain';
import { GenresService } from '../../../application';
import { CreateGenreDto } from './create-genre.dto';
import { UpdateGenreDto } from './update-genre.dto';

@ApiTags('Genres')
@Controller('genres')
export class GenresController {
    constructor(private readonly genresService: GenresService) {}

    @ApiOkResponse({ description: 'List genres' })
    @Get()
    async findAll() {
        const genres = await this.genresService.findAll();
        return genres.map((genre) => this.toGenreResponse(genre));
    }

    @ApiOkResponse({ description: 'Get genre by id' })
    @Get(':id')
    async findOne(@Param('id') genreId: string) {
        const genreOption = await this.genresService.findOneById(genreId);
        if (genreOption.isNone()) {
            throw new NotFoundException('Genre not found');
        }

        return this.toGenreResponse(genreOption.unwrap());
    }

    @ApiCreatedResponse({ description: 'Genre created' })
    @Post()
    async create(@Body() body: CreateGenreDto) {
        const result = await this.genresService.create({
            ownerId: body.ownerId,
            name: body.name,
        });

        return match(result, {
            Ok: (genre: GenreEntity) => this.toGenreResponse(genre),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Genre updated' })
    @Patch(':id')
    async update(@Param('id') genreId: string, @Body() body: UpdateGenreDto) {
        const result = await this.genresService.update(genreId, {
            ownerId: body.ownerId,
            name: body.name,
        });

        return match(result, {
            Ok: (genre: GenreEntity) => this.toGenreResponse(genre),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Genre deleted' })
    @Delete(':id')
    async delete(@Param('id') genreId: string) {
        const result = await this.genresService.delete(genreId);
        return match(result, {
            Ok: () => ({ deleted: true }),
            Err: (error) => this.throwMappedError(error),
        });
    }

    private throwMappedError(error: Error): never {
        if (error instanceof CatalogRecordNotFoundError) {
            throw new NotFoundException(error.message);
        }

        throw new InternalServerErrorException(error.message);
    }

    private toGenreResponse(genre: GenreEntity) {
        const props = genre.getProps();
        return {
            id: props.id,
            ownerId: props.ownerId,
            name: props.name,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }
}
