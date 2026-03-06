import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../columns.helpers';
import { AlbumsTable } from './albums';
import { ProducersTable } from '../producers';

export const AlbumsProducersTable = pgTable(
    'albums_producers',
    {
        ...timestamps,
        producerId: text('producer_id')
            .notNull()
            .references(() => ProducersTable.id),
        albumId: text('album_id')
            .references(() => AlbumsTable.id)
            .notNull(),
    },
    (columns) => ({
        pk: primaryKey({ columns: [columns.producerId, columns.albumId] }),
    })
);
