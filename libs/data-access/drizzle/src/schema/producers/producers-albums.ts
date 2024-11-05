import { primaryKey, pgTable, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../columns.helpers';
import { ProducersTable } from './producers';
import { AlbumsTable } from '../albums/albums';

export const ProducersAlbumsTable = pgTable(
    'producers_albums',
    {
        ...timestamps,
        producerId: text('producer_id')
            .notNull()
            .references(() => ProducersTable.id),
        albumId: text('album_id')
            .notNull()
            .references(() => AlbumsTable.id),
    },
    (columns) => ({
        pk: primaryKey({ columns: [columns.producerId, columns.albumId] }),
    })
);
