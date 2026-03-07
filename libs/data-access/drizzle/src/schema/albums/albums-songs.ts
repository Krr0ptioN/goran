import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../columns.helpers';
import { SongsTable } from '../songs/songs';
import { AlbumsTable } from './albums';

export const AlbumsSongsTable = pgTable(
    'albums_songs',
    {
        ...timestamps,
        songId: text('song_id')
            .references(() => SongsTable.id)
            .notNull(),
        albumId: text('album_id')
            .references(() => AlbumsTable.id)
            .notNull(),
    },
    (columns) => ({
        pk: primaryKey({ columns: [columns.songId, columns.albumId] }),
    })
);
