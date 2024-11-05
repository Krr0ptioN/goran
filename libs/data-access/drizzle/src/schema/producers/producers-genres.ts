import { primaryKey, pgTable, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../columns.helpers';
import { ProducersTable } from './producers';
import { GenresTable } from '../genres/genres';

export const ProducersGenresTable = pgTable(
    'producers_genres',
    {
        ...timestamps,
        producerId: text('producer_id')
            .notNull()
            .references(() => ProducersTable.id),
        genreId: text('genre_id')
            .notNull()
            .references(() => GenresTable.id),
    },
    (columns) => ({
        pk: primaryKey({ columns: [columns.producerId, columns.genreId] }),
    })
);
