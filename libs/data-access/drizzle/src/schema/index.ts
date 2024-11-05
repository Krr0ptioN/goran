import { UsersTable } from './users';
import {
    PasswordResetRequestsTable,
    passwordResetStatusEnum,
} from './password-reset';
import { SessionsTable, sessionStatusEnum } from './sessions';
import {
    ProducersTable,
    ProducersGenresTable,
    ProducersSongsTable,
    ProducersAlbumsTable,
} from './producers';
import { GenresTable } from './genres/genres';
import { PlaylistsSongsTable, PlaylistsTable } from './playlists';
import { SongsTable, SongsGenresTable } from './songs';
import { AlbumsTable, AlbumsProducersTable, AlbumsSongsTable } from './albums';

export default {
    // Users
    UsersTable,

    // Producers
    ProducersTable,
    ProducersSongsTable,
    ProducersAlbumsTable,
    ProducersGenresTable,

    // Playlists
    PlaylistsTable,
    PlaylistsSongsTable,

    // Songs
    SongsTable,
    SongsGenresTable,

    //Albums
    AlbumsTable,
    AlbumsSongsTable,
    AlbumsProducersTable,

    // Genres
    GenresTable,

    // Passoword reset request
    PasswordResetRequestsTable,
    passwordResetStatusEnum,

    // Session
    sessionStatusEnum,
    SessionsTable,
};
