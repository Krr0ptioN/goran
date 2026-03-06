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
import { AlbumEntity, CatalogRecordNotFoundError } from '../../../domain';
import { AlbumsService } from '../../../application';
import { CreateAlbumDto } from './create-album.dto';
import { UpdateAlbumDto } from './update-album.dto';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
    constructor(private readonly albumsService: AlbumsService) {}

    @ApiOkResponse({ description: 'List albums' })
    @Get()
    async findAll() {
        const albums = await this.albumsService.findAll();
        return albums.map((album) => this.toAlbumResponse(album));
    }

    @ApiOkResponse({ description: 'Get album by id' })
    @Get(':id')
    async findOne(@Param('id') albumId: string) {
        const albumOption = await this.albumsService.findOneById(albumId);
        if (albumOption.isNone()) {
            throw new NotFoundException('Album not found');
        }

        return this.toAlbumResponse(albumOption.unwrap());
    }

    @ApiCreatedResponse({ description: 'Album created' })
    @Post()
    async create(@Body() body: CreateAlbumDto) {
        const result = await this.albumsService.create({
            name: body.name,
            releasedDate: body.releasedDate
                ? new Date(body.releasedDate)
                : null,
            coverImageKey: body.coverImageKey ?? null,
            producerIds: body.producerIds ?? [],
            songIds: body.songIds ?? [],
        });

        return match(result, {
            Ok: (album: AlbumEntity) => this.toAlbumResponse(album),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Album updated' })
    @Patch(':id')
    async update(@Param('id') albumId: string, @Body() body: UpdateAlbumDto) {
        const result = await this.albumsService.update(albumId, {
            name: body.name,
            releasedDate: body.releasedDate
                ? new Date(body.releasedDate)
                : undefined,
            coverImageKey: body.coverImageKey,
            producerIds: body.producerIds,
            songIds: body.songIds,
        });

        return match(result, {
            Ok: (album: AlbumEntity) => this.toAlbumResponse(album),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Album deleted' })
    @Delete(':id')
    async delete(@Param('id') albumId: string) {
        const result = await this.albumsService.delete(albumId);
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

    private toAlbumResponse(album: AlbumEntity) {
        const props = album.getProps();
        return {
            id: props.id,
            name: props.name,
            releasedDate: props.releasedDate,
            coverImageKey: props.coverImageKey,
            producerIds: props.producerIds,
            songIds: props.songIds,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }
}
