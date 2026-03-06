import { Module } from '@nestjs/common';
import {
    AlbumsController,
    GenresController,
    PlaylistsController,
    ProducersController,
    SongsController,
} from './presenters/http';
import {
    AddSongCommandHandler,
    AlbumsRepository,
    AlbumsService,
    GenresRepository,
    GenresService,
    PlaylistsRepository,
    PlaylistsService,
    ProducersRepository,
    ProducersService,
    SongsRepository,
    SongsService,
} from './application';
import {
    AlbumsRepositoryDrizzle,
    GenresRepositoryDrizzle,
    PlaylistsRepositoryDrizzle,
    ProducersRepositoryDrizzle,
    SongsRepositoryDrizzle,
} from './infrastructure';

@Module({
    controllers: [
        SongsController,
        ProducersController,
        AlbumsController,
        GenresController,
        PlaylistsController,
    ],
    providers: [
        AddSongCommandHandler,
        SongsService,
        ProducersService,
        AlbumsService,
        GenresService,
        PlaylistsService,
        {
            provide: SongsRepository,
            useClass: SongsRepositoryDrizzle,
        },
        {
            provide: ProducersRepository,
            useClass: ProducersRepositoryDrizzle,
        },
        {
            provide: AlbumsRepository,
            useClass: AlbumsRepositoryDrizzle,
        },
        {
            provide: GenresRepository,
            useClass: GenresRepositoryDrizzle,
        },
        {
            provide: PlaylistsRepository,
            useClass: PlaylistsRepositoryDrizzle,
        },
    ],
    exports: [],
})
export class CatalogModule {}
