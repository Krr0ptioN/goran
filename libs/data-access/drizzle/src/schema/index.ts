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
import { PlaylistsSongsTable, PlaylistsTable } from './playlists';
import { GenresTable } from './genres/genres';
import { SongsTable, SongsGenresTable } from './songs/songs';
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
