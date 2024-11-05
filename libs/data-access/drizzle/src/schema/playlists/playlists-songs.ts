import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { PlaylistsTable } from './playlists';
import { SongsTable } from '../songs/songs';
import { timestamps } from '../columns.helpers';

export const PlaylistsSongsTable = pgTable(
    'playlists_songs',
    {
        ...timestamps,
        playlistId: text('playlist_id')
            .references(() => PlaylistsTable.id)
            .notNull(),
        songId: text('song_id')
            .references(() => SongsTable.id)
            .notNull(),
    },
    (columns) => ({
        pk: primaryKey({ columns: [columns.playlistId, columns.songId] }),
    })
);
