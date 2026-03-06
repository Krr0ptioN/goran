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
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FilesService, BufferedFile } from '@goran/files';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { match } from 'oxide.ts';
import { CatalogRecordNotFoundError, SongEntity } from '../../../domain';
import { SongsService } from '../../../application';
import { CreateSongDto } from './create-song.dto';
import { UpdateSongDto } from './update-song.dto';

@ApiTags('Songs')
@Controller('songs')
export class SongsController {
    constructor(
        private readonly filesService: FilesService,
        private readonly songsService: SongsService,
    ) {}

    @ApiOkResponse({ description: 'List songs' })
    @Get()
    async findAll() {
        const songs = await this.songsService.findAll();
        return songs.map((song) => this.toSongResponse(song));
    }

    @ApiOkResponse({ description: 'Get song by id' })
    @Get(':id')
    async findOne(@Param('id') songId: string) {
        const songOption = await this.songsService.findOneById(songId);
        if (songOption.isNone()) {
            throw new NotFoundException('Song not found');
        }

        return this.toSongResponse(songOption.unwrap());
    }

    @ApiCreatedResponse({ description: 'Song metadata created' })
    @Post()
    async create(@Body() body: CreateSongDto) {
        const result = await this.songsService.create({
            userId: body.userId,
            title: body.title,
            duration: body.duration,
            releasedDate: body.releasedDate
                ? new Date(body.releasedDate)
                : null,
            audioFileKey: body.audioFileKey ?? null,
            coverImageKey: body.coverImageKey ?? null,
            albumId: body.albumId ?? null,
            producerIds: body.producerIds ?? [],
            genreIds: body.genreIds ?? [],
        });

        return match(result, {
            Ok: (song: SongEntity) => this.toSongResponse(song),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Song metadata updated' })
    @Patch(':id')
    async update(@Param('id') songId: string, @Body() body: UpdateSongDto) {
        const result = await this.songsService.update(songId, {
            userId: body.userId,
            title: body.title,
            duration: body.duration,
            releasedDate: body.releasedDate
                ? new Date(body.releasedDate)
                : undefined,
            audioFileKey: body.audioFileKey,
            coverImageKey: body.coverImageKey,
            albumId: body.albumId,
            producerIds: body.producerIds,
            genreIds: body.genreIds,
        });

        return match(result, {
            Ok: (song: SongEntity) => this.toSongResponse(song),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @ApiOkResponse({ description: 'Song deleted' })
    @Delete(':id')
    async delete(@Param('id') songId: string) {
        const result = await this.songsService.delete(songId);
        return match(result, {
            Ok: () => ({ deleted: true }),
            Err: (error) => this.throwMappedError(error),
        });
    }

    @Post('media/upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiCreatedResponse({
        description: 'The song file has been uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                key: { type: 'string' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadSong(@UploadedFile() file: BufferedFile) {
        const uploadResult = await this.filesService.upload({
            file,
            bucketName: 'songs',
        });
        return match(uploadResult, {
            Ok: ({ url, key }) => ({ url, key }),
            Err: () => ({}),
        });
    }

    @Post('cover/upload')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiCreatedResponse({
        description: 'The cover image has been uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                key: { type: 'string' },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadCover(@UploadedFile() file: BufferedFile) {
        const uploadResult = await this.filesService.upload({
            file,
            bucketName: 'covers',
        });
        return match(uploadResult, {
            Ok: ({ url, key }) => ({ url, key }),
            Err: () => ({}),
        });
    }

    private throwMappedError(error: Error): never {
        if (error instanceof CatalogRecordNotFoundError) {
            throw new NotFoundException(error.message);
        }

        throw new InternalServerErrorException(error.message);
    }

    private toSongResponse(song: SongEntity) {
        const props = song.getProps();
        return {
            id: props.id,
            userId: props.userId,
            title: props.title,
            duration: props.duration,
            releasedDate: props.releasedDate,
            audioFileKey: props.audioFileKey,
            coverImageKey: props.coverImageKey,
            albumId: props.albumId,
            producerIds: props.producerIds,
            genreIds: props.genreIds,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }
}
