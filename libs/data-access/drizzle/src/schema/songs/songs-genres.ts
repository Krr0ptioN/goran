import { primaryKey, pgTable, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../columns.helpers';
import { SongsTable } from './songs';
import { GenresTable } from '../genres/genres';

export const SongsGenresTable = pgTable(
    'songs_genres',
    {
        ...timestamps,
        songId: text('song_id')
            .notNull()
            .references(() => SongsTable.id),
        genreId: text('genre_id')
            .notNull()
            .references(() => GenresTable.id),
    },
    (columns) => ({
        pk: primaryKey({ columns: [columns.songId, columns.genreId] }),
    })
);
