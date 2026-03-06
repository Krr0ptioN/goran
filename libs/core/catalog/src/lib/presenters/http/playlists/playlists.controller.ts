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
import { CatalogRecordNotFoundError, PlaylistEntity } from '../../../domain';
import { PlaylistsService } from '../../../application';
import { CreatePlaylistDto } from './create-playlist.dto';
import { UpdatePlaylistDto } from './update-playlist.dto';

@ApiTags('Playlists')
@Controller('playlists')
export class PlaylistsController {
    constructor(private readonly playlistsService: PlaylistsService) {}

    @ApiOkResponse({ description: 'List playlists' })
    @Get()
    async findAll() {
        const playlists = await this.playlistsService.findAll();
        return playlists.map((playlist) => this.toPlaylistResponse(playlist));
    }

    @ApiOkResponse({ description: 'Get playlist by id' })
    @Get(':id')
    async findOne(@Param('id') playlistId: string) {
        const playlistOption =
            await this.playlistsService.findOneById(playlistId);
        if (playlistOption.isNone()) {
            throw new NotFoundException('Playlist not found');
        }

        return this.toPlaylistResponse(playlistOption.unwrap());
    }

    @ApiCreatedResponse({ description: 'Playlist created' })
    @Post()
    async create(@Body() body: CreatePlaylistDto) {
        const result = await this.playlistsService.create({
            ownerId: body.ownerId,
            name: body.name,
            description: body.description ?? null,
            coverImageKey: body.coverImageKey ?? null,
            songIds: body.songIds ?? [],
        });

        return match(result, {
            Ok: (playlist: PlaylistEntity) => this.toPlaylistResponse(playlist),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Playlist updated' })
    @Patch(':id')
    async update(
        @Param('id') playlistId: string,
        @Body() body: UpdatePlaylistDto,
    ) {
        const result = await this.playlistsService.update(playlistId, {
            ownerId: body.ownerId,
            name: body.name,
            description: body.description,
            coverImageKey: body.coverImageKey,
            songIds: body.songIds,
        });

        return match(result, {
            Ok: (playlist: PlaylistEntity) => this.toPlaylistResponse(playlist),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Playlist deleted' })
    @Delete(':id')
    async delete(@Param('id') playlistId: string) {
        const result = await this.playlistsService.delete(playlistId);
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

    private toPlaylistResponse(playlist: PlaylistEntity) {
        const props = playlist.getProps();
        return {
            id: props.id,
            ownerId: props.ownerId,
            name: props.name,
            description: props.description,
            coverImageKey: props.coverImageKey,
            songIds: props.songIds,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }
}
