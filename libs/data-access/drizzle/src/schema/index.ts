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
import { SongsTable } from './songs/songs';
import { SongsGenresTable } from './songs/songs-genres';

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

    // Genres
    GenresTable,

    // Passoword reset request
    PasswordResetRequestsTable,
    passwordResetStatusEnum,

    // Session
    sessionStatusEnum,
    SessionsTable,
};
